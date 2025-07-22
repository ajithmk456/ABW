import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LOGO_BASE64 } from '../../../assets/logo.base64';
import { QR_BASE64 } from '../../../assets/qr.base64';
declare const pdfMake: any;

@Component({
  selector: 'app-create-quotation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-quotation.component.html',
  styleUrls: ['./create-quotation.component.scss']
})
export class CreateQuotationComponent {
  customer = {
    companyName: '',
    address: '',
    contact: '',
    gstNumber: ''
  };

  items = [
    { name: '', hsn: '', quantity: 1, unit: '', unitPrice: 0 }
  ];

  description: string = 'GST 18% Extra\n85% payment advance';
  total = 0;
  totalInWords = '';

  selectedDate: string = ''; // YYYY-MM-DD
  finalQuotationDate: string = ''; // Used in PDF
  quotationCodes: string = '';

  onDateChange() {
    const date = new Date(this.selectedDate);
    const formatted = `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;
    this.finalQuotationDate = formatted;
  }

  addItem() {
    this.items.push({ name: '', hsn: '', quantity: 1, unit: '', unitPrice: 0 });
  }

  removeItem(index: number) {
    this.items.splice(index, 1);
    this.updateTotal();
  }

  updateTotal() {
    this.total = this.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    this.totalInWords = this.numberToWords(this.total);
  }

  numberToWords(amount: number): string {
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    });
    const rupees = formatter.format(amount).replace('₹', '').trim();
    return `${rupees} Rupees only`;
  }
  getAmount(item: any): string {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.unitPrice) || 0;
    const total = qty * price;
    return total.toFixed(2);
  }

  generatePDF() {
    const estimateCode = `ABW_${this.quotationCodes.toString().padStart(2, '0')}`;
    const total = this.total;

    const documentDefinition = {
      pageMargins: [40, 40, 40, 60],

      background: function (_: number, pageSize: { width: number; height: number }) {
        return {
          image: LOGO_BASE64,
          width: 200,
          opacity: 0.05,
          absolutePosition: { x: (pageSize.width - 200) / 2, y: 100 }
        };
      },

      content: [
        {
          columns: [
            {
              image: LOGO_BASE64,
              width: 80,
              margin: [0, 0, 10, 0]
            },
            {
              width: '*',
              stack: [
                { text: 'QUOTATION', style: 'quoteTitle' },
                { text: 'SRI AMMAN LABOUR BODY WORKS', style: 'header' },
                {
                  text: 'SF No.254/1B, L&T Bypass Road, Madukkarai\nPhone: 9363269771 | GSTIN: 33APDPR4829J1ZN\nEmail: ammanrajan771@gmail.com',
                  style: 'subheader'
                }
              ],
              alignment: 'center'
            },
            {
              width: 'auto',
              stack: [
                { text: `Estimate No: ${estimateCode}`, alignment: 'right' },
                { text: `Date: ${this.finalQuotationDate || new Date().toLocaleDateString('en-GB')}`, alignment: 'right' }
              ]
            }
          ],
          columnGap: 10,
          margin: [0, 0, 0, 20]
        },

        {
          stack: [
            { text: 'Estimate For:', bold: true, margin: [0, 5, 0, 2] },
            { text: this.customer.companyName.toUpperCase(), bold: true },
            { text: this.customer.address },
            { text: `Contact: ${this.customer.contact}` },
            ...(this.customer.gstNumber ? [{ text: `GST No: ${this.customer.gstNumber}` }] : [])
          ],
          style: 'customer'
        },

        {
          table: {
            headerRows: 1,
            widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto'],
            body: [
              [
                { text: '#', bold: true },
                { text: 'Item Name', bold: true },
                { text: 'HSN/SAC', bold: true },
                { text: 'Qty', bold: true },
                { text: 'Price/Unit', bold: true },
                { text: 'Amount', bold: true }
              ],
              ...this.items.map((item, index) => [
                index + 1,
                item.name,
                item.hsn,
                `${item.quantity} ${item.unit}`,
                `₹ ${item.unitPrice.toFixed(2)}`,
                `₹ ${(item.quantity * item.unitPrice).toFixed(2)}`
              ])
            ]
          },
          layout: {
            fillColor: (rowIndex: number) => rowIndex === 0 ? '#f5f5f5' : null,
            hLineWidth: () => 0.8,
            vLineWidth: () => 0.8
          },
          margin: [0, 0, 0, 10]
        },

        {
          columns: [
            { text: '' },
            {
              table: {
                widths: ['*', 'auto'],
                body: [
                  [{ text: 'Total', bold: true }, { text: `₹ ${total.toFixed(2)}`, bold: true }]
                ]
              },
              layout: {
                hLineWidth: () => 0.8,
                vLineWidth: () => 0.8
              },
              alignment: 'right'
            }
          ],
          margin: [0, 0, 0, 10]
        },

        {
          text: [
            { text: 'Amount in Words: ', bold: true },
            { text: this.totalInWords, italics: true }
          ],
          margin: [0, 0, 0, 10]
        },

        { text: 'Payment Terms:', bold: true, margin: [0, 0, 0, 2] },
        { text: this.description, margin: [0, 0, 0, 10] },

        // ✅ Bank details and signature block without QR
        {
          table: {
            widths: ['*', '*'],
            body: [
              [
                {
                  stack: [
                    { text: 'Bank Details', bold: true, margin: [0, 0, 0, 5] },
                    { text: 'Name: Indian Overseas Bank, Madukkarai' },
                    { text: 'Account No.: 271502000000121' },
                    { text: 'IFSC code: IOBA0002715' },
                    { text: "Account Holder's Name: Sri Amman Labour Body Works" }
                  ],
                  fontSize: 9
                },
                {
                  stack: [
                    { text: 'For: SRI AMMAN LABOUR BODY WORKS', alignment: 'center' },
                    { text: '\n\n\nAuthorized Signatory', bold: true, alignment: 'center' }
                  ]
                }
              ]
            ]
          },
          layout: {
            hLineWidth: () => 0.8,
            vLineWidth: () => 0.8
          },
          margin: [0, 30, 0, 0]
        }
      ],

      styles: {
        quoteTitle: {
          fontSize: 20,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 4]
        },
        header: {
          fontSize: 16,
          bold: true,
          alignment: 'center',
          margin: [0, 4, 0, 2]
        },
        subheader: {
          fontSize: 10,
          alignment: 'center',
          margin: [0, 0, 0, 10]
        },
        customer: {
          fontSize: 11,
          margin: [0, 0, 0, 10]
        }
      },

      defaultStyle: {
        fontSize: 10,
        lineHeight: 1.2
      }
    };

    const safeCompanyName = this.customer.companyName.toLowerCase().replace(/\s+/g, '_');
    const fileName = `${safeCompanyName}_quotation_${estimateCode}.pdf`;
    pdfMake.createPdf(documentDefinition).download(fileName);
  }
}
