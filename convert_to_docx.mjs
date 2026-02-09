/**
 * Markdown to Word (.docx) Converter
 * Converts the user_flow_guide.md to a Word document
 */

import {
    Document,
    Packer,
    Paragraph,
    TextRun,
    HeadingLevel,
    Table,
    TableRow,
    TableCell,
    WidthType,
    BorderStyle,
    AlignmentType,
    ShadingType,
} from 'docx';
import * as fs from 'fs';

// Read the markdown file
const mdContent = fs.readFileSync(
    'C:/Users/Area2/.gemini/antigravity/brain/d57df098-cc16-4fa3-ba86-3c197907ddcf/user_flow_guide.md',
    'utf-8'
);

// Parse markdown and create document elements
function parseMarkdown(content) {
    const lines = content.split('\n');
    const elements = [];
    let inCodeBlock = false;
    let codeBlockContent = [];
    let inTable = false;
    let tableRows = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Handle code blocks (mermaid diagrams, etc.)
        if (line.startsWith('```')) {
            if (inCodeBlock) {
                // End of code block
                const codeType = codeBlockContent[0] || 'code';
                if (codeType.includes('mermaid')) {
                    elements.push(
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: '📊 [DIAGRAM - View in Markdown viewer for visual representation]',
                                    italics: true,
                                    color: '666666',
                                }),
                            ],
                            spacing: { before: 200, after: 100 },
                        })
                    );
                    // Add simplified text representation
                    elements.push(
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: codeBlockContent.slice(1).join('\n'),
                                    font: 'Consolas',
                                    size: 18,
                                    color: '444444',
                                }),
                            ],
                            shading: { type: ShadingType.SOLID, color: 'F5F5F5' },
                            spacing: { before: 100, after: 200 },
                        })
                    );
                } else {
                    // Regular code block
                    elements.push(
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: codeBlockContent.slice(1).join('\n'),
                                    font: 'Consolas',
                                    size: 18,
                                }),
                            ],
                            shading: { type: ShadingType.SOLID, color: 'F0F0F0' },
                            spacing: { before: 100, after: 200 },
                        })
                    );
                }
                codeBlockContent = [];
                inCodeBlock = false;
            } else {
                // Start of code block
                inCodeBlock = true;
                codeBlockContent.push(line.replace('```', '').trim());
            }
            continue;
        }

        if (inCodeBlock) {
            codeBlockContent.push(line);
            continue;
        }

        // Handle tables
        if (line.startsWith('|')) {
            if (!inTable) {
                inTable = true;
                tableRows = [];
            }
            // Skip separator rows
            if (!line.match(/^\|[\s\-:|]+\|$/)) {
                const cells = line.split('|').filter((c) => c.trim() !== '');
                tableRows.push(cells.map((c) => c.trim()));
            }
            continue;
        } else if (inTable && tableRows.length > 0) {
            // End of table, create table element
            const table = createTable(tableRows);
            elements.push(table);
            elements.push(new Paragraph({ text: '' }));
            tableRows = [];
            inTable = false;
        }

        // Skip empty lines in certain contexts
        if (line.trim() === '') {
            elements.push(new Paragraph({ text: '' }));
            continue;
        }

        // Handle headings
        if (line.startsWith('# ')) {
            elements.push(
                new Paragraph({
                    text: line.replace('# ', ''),
                    heading: HeadingLevel.HEADING_1,
                    spacing: { before: 400, after: 200 },
                })
            );
        } else if (line.startsWith('## ')) {
            elements.push(
                new Paragraph({
                    text: line.replace('## ', ''),
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 300, after: 150 },
                })
            );
        } else if (line.startsWith('### ')) {
            elements.push(
                new Paragraph({
                    text: line.replace('### ', ''),
                    heading: HeadingLevel.HEADING_3,
                    spacing: { before: 200, after: 100 },
                })
            );
        } else if (line.startsWith('> ')) {
            // Blockquote
            elements.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: line.replace('> ', ''),
                            italics: true,
                            color: '555555',
                        }),
                    ],
                    indent: { left: 720 },
                    spacing: { before: 100, after: 100 },
                })
            );
        } else if (line.startsWith('---')) {
            // Horizontal rule
            elements.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: '━'.repeat(50),
                            color: 'CCCCCC',
                        }),
                    ],
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 200, after: 200 },
                })
            );
        } else if (line.match(/^<details>/)) {
            // Skip HTML tags
            continue;
        } else if (line.match(/^<\/details>/)) {
            continue;
        } else if (line.match(/^<summary>/)) {
            const text = line.replace(/<\/?summary>/g, '').replace(/<\/?b>/g, '');
            elements.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: '▸ ' + text,
                            bold: true,
                        }),
                    ],
                    spacing: { before: 100, after: 50 },
                })
            );
        } else {
            // Regular paragraph with inline formatting
            const runs = parseInlineFormatting(line);
            elements.push(
                new Paragraph({
                    children: runs,
                    spacing: { before: 50, after: 50 },
                })
            );
        }
    }

    // Handle any remaining table
    if (inTable && tableRows.length > 0) {
        elements.push(createTable(tableRows));
    }

    return elements;
}

function parseInlineFormatting(text) {
    const runs = [];
    let currentText = text;

    // Simple parsing - handle **bold** and basic text
    const parts = currentText.split(/(\*\*[^*]+\*\*)/g);

    for (const part of parts) {
        if (part.startsWith('**') && part.endsWith('**')) {
            runs.push(
                new TextRun({
                    text: part.slice(2, -2),
                    bold: true,
                })
            );
        } else if (part.trim()) {
            runs.push(new TextRun({ text: part }));
        }
    }

    return runs.length > 0 ? runs : [new TextRun({ text })];
}

function createTable(rows) {
    const tableRows = rows.map((row, rowIndex) => {
        const cells = row.map(
            (cell) =>
                new TableCell({
                    children: [
                        new Paragraph({
                            children: parseInlineFormatting(cell),
                            alignment: AlignmentType.LEFT,
                        }),
                    ],
                    shading:
                        rowIndex === 0
                            ? { type: ShadingType.SOLID, color: 'E8E8E8' }
                            : undefined,
                })
        );
        return new TableRow({ children: cells });
    });

    return new Table({
        rows: tableRows,
        width: { size: 100, type: WidthType.PERCENTAGE },
    });
}

// Create the document
const doc = new Document({
    sections: [
        {
            properties: {},
            children: parseMarkdown(mdContent),
        },
    ],
});

// Generate and save the document
const outputPath = 'C:/Jerry/Workspace/Area24one/Area24One_User_Flow_Guide.docx';

Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync(outputPath, buffer);
    console.log(`✅ Word document created successfully!`);
    console.log(`📄 File saved to: ${outputPath}`);
});
