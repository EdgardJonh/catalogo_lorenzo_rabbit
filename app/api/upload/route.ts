import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const bucket = process.env.SUPABASE_BUCKET || 'conejos';

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: 'Configuración de Supabase no encontrada' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const path = (formData.get('path') as string | null) || '';

    if (!file) {
      return NextResponse.json({ error: 'Archivo requerido' }, { status: 400 });
    }
    if (!path) {
      return NextResponse.json({ error: 'Path requerido' }, { status: 400 });
    }

    // Validar tamaño del archivo (opcional: máximo 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'El archivo es demasiado grande (máximo 10MB)' },
        { status: 400 }
      );
    }

    const fileArrayBuffer = await file.arrayBuffer();
    const fileBytes = new Uint8Array(fileArrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, fileBytes, {
        contentType: file.type || 'application/octet-stream',
        upsert: true,
      });

    if (uploadError) {
      console.error('Error de Supabase Storage:', uploadError);
      return NextResponse.json(
        { error: uploadError.message || 'Error al subir archivo' },
        { status: 400 }
      );
    }

    const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(path);
    
    if (!publicData?.publicUrl) {
      return NextResponse.json(
        { error: 'No se pudo obtener la URL pública' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { ok: true, url: publicData.publicUrl },
      { status: 200 }
    );
  } catch (e: any) {
    console.error('Error en /api/upload:', e);
    return NextResponse.json(
      { error: e?.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}


