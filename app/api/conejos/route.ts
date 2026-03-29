import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Configuración de Supabase no encontrada');
  }

  return createClient(supabaseUrl, serviceRoleKey);
}

function toISODateFromDMY(dmy: string): string {
  if (!dmy) return dmy;
  const norm = dmy.replace(/\//g, '-');
  // Si ya viene en ISO, devolver igual
  if (/^\d{4}-\d{2}-\d{2}$/.test(norm)) return norm;
  const [dd, mm, yyyy] = norm.split('-');
  if (!dd || !mm || !yyyy) return dmy;
  return `${yyyy}-${mm}-${dd}`;
}

export async function POST(req: Request) {
  try {
    const supabase = getSupabaseClient();
    const body = await req.json();

    const fechaISO = toISODateFromDMY(body.fechaNacimiento);

    const porcentajeDescuento = body.porcentaje_descuento ?? (body.tieneDescuento ? 30 : 0);
    const tieneDescuento = porcentajeDescuento > 0;

    const payload = {
      id: body.id,
      raza: body.raza,
      sexo: body.sexo,
      precio: body.precio,
      tiene_descuento: tieneDescuento,
      porcentaje_descuento: porcentajeDescuento,
      fecha_nacimiento: fechaISO,
      disponibilidad: body.disponibilidad,
      foto_principal: body.fotoPrincipal,
      fotos_adicionales: body.fotosAdicionales || [],
      reproductor: body.reproductor,
      categoria: body.categoria || 'ventas',
      visible: body.visible !== undefined ? body.visible : true, // Default true
    };

    const { error } = await supabase.from('conejos').upsert(payload, { onConflict: 'id' });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const supabase = getSupabaseClient();
    const body = await req.json();
    const { id, visible, disponibilidad } = body;

    if (!id) {
      return NextResponse.json({ error: 'id requerido' }, { status: 400 });
    }

    const patch: Record<string, boolean | string> = {};
    if (visible !== undefined) patch.visible = visible;
    if (disponibilidad !== undefined) {
      if (disponibilidad !== 'Disponible' && disponibilidad !== 'no Disponible') {
        return NextResponse.json({ error: 'disponibilidad inválida' }, { status: 400 });
      }
      patch.disponibilidad = disponibilidad;
    }

    if (Object.keys(patch).length === 0) {
      return NextResponse.json(
        { error: 'Se requiere visible y/o disponibilidad' },
        { status: 400 }
      );
    }

    const { error } = await supabase.from('conejos').update(patch).eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const supabase = getSupabaseClient();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id requerido' }, { status: 400 });

    const { error } = await supabase.from('conejos').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Error' }, { status: 500 });
  }
}



