import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import xml2js from 'xml2js';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');
    if (!section) {
      return NextResponse.json({ error: 'Section query parameter is required' }, { status: 400 });
    }

    // Protect/ignore 'resume' since it's a binary PDF and not XML
    if (section === 'resume') {
      return NextResponse.json({ error: 'Resume is a PDF and cannot be edited as XML.' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'data', `${section}.xml`);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: `XML file for section "${section}" not found` }, { status: 404 });
    }

    const xmlContent = fs.readFileSync(filePath, 'utf-8');
    return NextResponse.json({ xml: xmlContent });
  } catch (error) {
    console.error('Error reading raw XML:', error);
    return NextResponse.json({ error: 'Failed to load raw XML data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { section, xml } = await request.json();
    if (!section || !xml) {
      return NextResponse.json({ error: 'Section and XML content are required' }, { status: 400 });
    }

    if (section === 'resume') {
      return NextResponse.json({ error: 'Resume is a PDF and cannot be edited as XML.' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'data', `${section}.xml`);
    
    // Validate XML format before writing to prevent data corruption
    const parser = new xml2js.Parser();
    try {
      await parser.parseStringPromise(xml);
    } catch (parseError: any) {
      const lineMsg = parseError.message || 'Invalid tag nesting or unclosed element';
      return NextResponse.json({ 
        error: `XML Validation Failed: ${lineMsg}. Content has not been saved.` 
      }, { status: 400 });
    }

    fs.writeFileSync(filePath, xml, 'utf-8');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error writing raw XML:', error);
    return NextResponse.json({ error: 'Failed to save XML data' }, { status: 500 });
  }
}
