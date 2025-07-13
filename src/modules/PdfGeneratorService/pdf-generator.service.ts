import { Injectable } from '@nestjs/common';
import PdfPrinter from 'pdfmake';
import * as fs from 'fs';
import * as path from 'path';
import type { TDocumentDefinitions } from 'pdfmake/interfaces';

@Injectable()
export class PdfGeneratorService {
    async generateUserPdf(user: any): Promise<Buffer> {
        // Rutas alternativas para las fuentes
        const fontPaths = [
            path.resolve('src/assets/fonts/Roboto-Regular.ttf'),
            path.resolve('node_modules/@fontsource/roboto/files/roboto-latin-400-normal.woff'),
            path.join(__dirname, '../../assets/fonts/Roboto-Regular.ttf'),
            path.join(process.cwd(), 'src/assets/fonts/Roboto-Regular.ttf')
        ];

        let regularFontPath: string;
        let boldFontPath: string;

        // Buscar la fuente en las posibles ubicaciones
        for (const fontPath of fontPaths) {
            if (fs.existsSync(fontPath)) {
                regularFontPath = fontPath;
                boldFontPath = fontPath.replace('Regular', 'Bold');
                if (!fs.existsSync(boldFontPath)) {
                    boldFontPath = fontPath; // Usar regular como fallback
                }
                break;
            }
        }

        if (!regularFontPath) {
            throw new Error('No se pudo encontrar los archivos de fuentes Roboto');
        }

        const fonts = {
            Roboto: {
                normal: regularFontPath,
                bold: boldFontPath,
                italics: boldFontPath.replace('Bold', 'Italic') || regularFontPath,
                bolditalics: boldFontPath.replace('Bold', 'BoldItalic') || boldFontPath
            },
        };

        const printer = new PdfPrinter(fonts);

        const docDefinition: TDocumentDefinitions = {
            pageSize: 'A4',
            pageMargins: [40, 60, 40, 60],
            header: {
                text: 'Salud360 - Detalle del Paciente',
                alignment: 'center',
                margin: [0, 20, 0, 30],
                fontSize: 18,
                bold: true,
                color: '#3B82F6'
            },
            content: [
                {
                    image: user.profileImage?.path || 'default-avatar-base64',
                    width: 80,
                    height: 80,
                    margin: [0, 0, 20, 20]
                },
                {
                    text: `${user.firstName} ${user.lastName}`,
                    style: 'patientName'
                },
                // Sección de Información Personal
                {
                    text: 'Información Personal',
                    style: 'sectionHeader'
                },
                {
                    margin: [0, 10, 0, 20],
                    table: {
                        widths: ['auto', '*'],
                        body: [
                            [
                                { text: 'Nombre(s):', bold: true },
                                `${user.firstName} ${user.lastName}`
                            ],
                            [
                                { text: 'Fecha de nacimiento:', bold: true },
                                user.dateBirth || 'No especificado'
                            ]
                        ]
                    }
                },

                // Sección de Contacto
                {
                    text: 'Información de Contacto',
                    style: 'sectionHeader'
                },
                {
                    margin: [0, 10, 0, 20],
                    table: {
                        widths: ['auto', '*'],
                        body: [
                            [
                                { text: 'Email:', bold: true },
                                user.email
                            ],
                            [
                                { text: 'Teléfono:', bold: true },
                                user.phone || 'No especificado'
                            ],
                            [
                                { text: 'Dirección:', bold: true },
                                user.address || 'No especificado'
                            ],
                            [
                                { text: 'Contacto emergencia:', bold: true },
                                user.contactEmergency || 'No especificado'
                            ]
                        ]
                    }
                },

                // Sección Médica
                {
                    text: 'Información Médica',
                    style: 'sectionHeader'
                },
                {
                    margin: [0, 10, 0, 20],
                    table: {
                        widths: ['auto', '*'],
                        body: [
                            [
                                { text: 'Tipo de sangre:', bold: true },
                                user.bloodType || 'No especificado'
                            ],
                            [
                                { text: 'Alergias:', bold: true },
                                user.allergies || 'Ninguna'
                            ]
                        ]
                    }
                }
            ],
            styles: {
                sectionHeader: {
                    fontSize: 14,
                    bold: true,
                    margin: [0, 0, 0, 10],
                    color: '#4B5563', // Gris oscuro
                    decoration: 'underline',
                    decorationColor: '#3B82F6', // Azul
                    decorationStyle: 'solid'
                },
                tableHeader: {
                    bold: true,
                    fontSize: 12,
                    color: '#1F2937' // Gris muy oscuro
                }
            },
            defaultStyle: {
                font: 'Roboto',
                fontSize: 12,
                lineHeight: 1.4
            }

        };

        const pdfDoc = printer.createPdfKitDocument(docDefinition);
        const chunks: any[] = [];

        return new Promise((resolve, reject) => {
            pdfDoc.on('data', chunk => chunks.push(chunk));
            pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
            pdfDoc.on('error', err => reject(err));
            pdfDoc.end();
        });
    }
}