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
  if (/^\d{4}-\d{2}-\d{2}$/.test(norm)) return norm;
  const [dd, mm, yyyy] = norm.split('-');
  if (!dd || !mm || !yyyy) return dmy;
  return `${yyyy}-${mm}-${dd}`;
}

// GET: Obtener todos los partos o uno por id
export async function GET(req: Request) {
  try {
    const supabase = getSupabaseClient();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const { data, error } = await supabase
        .from('partos')
        .select('*')
        .eq('id', id)
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    const { data, error } = await supabase
      .from('partos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data || []);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Error' }, { status: 500 });
  }
}

// POST: Crear o actualizar un parto
export async function POST(req: Request) {
  try {
    const supabase = getSupabaseClient();
    const body = await req.json();

    if (!body.idCruza || !body.fechaParto) {
      return NextResponse.json(
        { error: 'idCruza y fechaParto son requeridos' },
        { status: 400 }
      );
    }

    const payload: any = {
      id: body.id,
      id_cruza: body.idCruza,
      fecha_parto: toISODateFromDMY(body.fechaParto),
      gazapos_totales: body.gazaposTotales ?? null,
      gazapos_vivos: body.gazaposVivos ?? null,
      observaciones: body.observaciones || null,
    };

    const { error } = await supabase
      .from('partos')
      .upsert(payload, { onConflict: 'id' });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Error' }, { status: 500 });
  }
}

// DELETE: Eliminar un parto
export async function DELETE(req: Request) {
  try {
    const supabase = getSupabaseClient();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id requerido' }, { status: 400 });

    const { error } = await supabase.from('partos').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Error' }, { status: 500 });
  }
}

