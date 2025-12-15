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

// GET: Obtener todas las cruzas
export async function GET(req: Request) {
  try {
    const supabase = getSupabaseClient();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      // Obtener una cruza específica
      const { data, error } = await supabase
        .from('cruzas')
        .select('*')
        .eq('id', id)
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    // Obtener todas las cruzas
    const { data, error } = await supabase
      .from('cruzas')
      .select('*')
      .order('fecha_cruza', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data || []);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Error' }, { status: 500 });
  }
}

// POST: Crear o actualizar una cruza
export async function POST(req: Request) {
  try {
    const supabase = getSupabaseClient();
    const body = await req.json();

    // Validaciones
    if (!body.idPadre || !body.idMadre || !body.fechaCruza) {
      return NextResponse.json(
        { error: 'idPadre, idMadre y fechaCruza son requeridos' },
        { status: 400 }
      );
    }

    if (body.idPadre === body.idMadre) {
      return NextResponse.json(
        { error: 'El padre y la madre deben ser diferentes' },
        { status: 400 }
      );
    }

    const fechaCruzaISO = toISODateFromDMY(body.fechaCruza);
    const fechaPartoEsperadoISO = body.fechaPartoEsperado
      ? toISODateFromDMY(body.fechaPartoEsperado)
      : null;
    const fechaPartoRealISO = body.fechaPartoReal
      ? toISODateFromDMY(body.fechaPartoReal)
      : null;

    const payload = {
      id: body.id,
      id_padre: body.idPadre,
      id_madre: body.idMadre,
      fecha_cruza: fechaCruzaISO,
      fecha_parto_esperado: fechaPartoEsperadoISO,
      fecha_parto_real: fechaPartoRealISO,
      estado: body.estado || 'programada',
      notas: body.notas || null,
    };

    const { error } = await supabase
      .from('cruzas')
      .upsert(payload, { onConflict: 'id' });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Error' }, { status: 500 });
  }
}

// PATCH: Actualizar estado o campos específicos de una cruza
export async function PATCH(req: Request) {
  try {
    const supabase = getSupabaseClient();
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'id requerido' }, { status: 400 });
    }

    // Convertir fechas si vienen
    const payload: any = {};
    if (updates.fechaCruza) payload.fecha_cruza = toISODateFromDMY(updates.fechaCruza);
    if (updates.fechaPartoEsperado !== undefined) {
      payload.fecha_parto_esperado = updates.fechaPartoEsperado
        ? toISODateFromDMY(updates.fechaPartoEsperado)
        : null;
    }
    if (updates.fechaPartoReal !== undefined) {
      payload.fecha_parto_real = updates.fechaPartoReal
        ? toISODateFromDMY(updates.fechaPartoReal)
        : null;
    }
    if (updates.estado) payload.estado = updates.estado;
    if (updates.notas !== undefined) payload.notas = updates.notas || null;

    const { error } = await supabase.from('cruzas').update(payload).eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Error' }, { status: 500 });
  }
}

// DELETE: Eliminar una cruza
export async function DELETE(req: Request) {
  try {
    const supabase = getSupabaseClient();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id requerido' }, { status: 400 });

    const { error } = await supabase.from('cruzas').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Error' }, { status: 500 });
  }
}

