import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LOGO_BASE64 } from '../../../assets/logo.base64';
import { QR_BASE64 } from '../../../assets/qr.base64';
declare const pdfMake: any;
@Component({
  selector: 'app-generate-bill',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './generate-bill.component.html',
  styleUrl: './generate-bill.component.scss'
})
export class GenerateBillComponent {

   customer = {
      companyName: '',
      address: '',
      contact: ''
    };
  
    items = [
      { name: '', hsn: '', quantity: 1, unit: '', unitPrice: 0 }
    ];
  
    description = '85% payment advance';
    total = 0;
    totalInWords = '';
  
    addItem() {
      this.items.push({ name: '', hsn: '', quantity: 1, unit: '', unitPrice: 0 });
    }
  
    removeItem(index: number) {
      this.items.splice(index, 1);
      this.updateTotal();
    }
  
    updateTotal() {
      this.total = this.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
      this.totalInWords = this.numberToWords(this.total + this.total * 0.18);
    }
  
    numberToWords(amount: number): string {
      const formatter = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
      });
      const rupees = formatter.format(amount).replace('₹', '').trim();
      return `${rupees} Rupees only`;
    }
    generatePDF() {
      const gstRate = 0.18;
      const cgst = this.total * 0.09;
      const sgst = this.total * 0.09;
      const totalWithGST = this.total + cgst + sgst;
    
      let estimateNumber = localStorage.getItem('lastEstimateNo');
      let nextNumber = estimateNumber ? parseInt(estimateNumber) + 1 : 1;
      localStorage.setItem('lastEstimateNo', nextNumber.toString());
    
      const estimateCode = `ABW_${nextNumber.toString().padStart(2, '0')}`;
    
      const documentDefinition = {
        pageMargins: [40, 40, 40, 60],
    
        // ✅ Watermark Logo Background
        background: function (_currentPage: number, pageSize: { width: number; height: number }) {
          return {
            image: LOGO_BASE64,
            width: 200,
            opacity: 0.05,
            absolutePosition: {
              x: (pageSize.width - 250) / 2, // ⬅️ Center horizontally
              y: 120                        // ⬇️ Slightly below header
            }
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
                  { text: `Date: ${new Date().toLocaleDateString('en-GB')}`, alignment: 'right' }
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
              { text: `Contact: ${this.customer.contact}` }
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
                    ['Sub Total', `₹ ${this.total.toFixed(2)}`],
                    ['CGST @9%', `₹ ${cgst.toFixed(2)}`],
                    ['SGST @9%', `₹ ${sgst.toFixed(2)}`],
                    [{ text: 'Total', bold: true }, { text: `₹ ${totalWithGST.toFixed(2)}`, bold: true }]
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
          { text: `Description:\n${this.description}`, margin: [0, 0, 0, 10] },
    
          // ✅ Footer: Bank Details + Signature
          {
            table: {
              widths: ['50%', '50%'],
              body: [
                [
                  {
                    stack: [
                      { text: 'Bank Details', bold: true, margin: [0, 0, 0, 6] },
                      {
                        columns: [
                          {
                            image: QR_BASE64,
                            width: 70,
                            margin: [0, 0, 10, 0]
                          },
                          {
                            stack: [
                              { text: 'Name: Indian Overseas Bank, Madukkarai' },
                              { text: 'Account No.: 271502000000121' },
                              { text: 'IFSC code: IOBA0002715' },
                              { text: "Account Holder's Name: Sri Amman Labour Body Works" }
                            ],
                            fontSize: 9
                          }
                        ]
                      }
                    ]
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
            margin: [0, 20, 0, 0]
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
          },
          section: {
            fontSize: 12,
            bold: true,
            margin: [0, 10, 0, 5]
          }
        },
        defaultStyle: {
          fontSize: 10,
          lineHeight: 1.2
        }
      };
    
      const safeCompanyName = this.customer.companyName.toUpperCase().replace(/\s+/g, '_');
      const fileName = `${safeCompanyName}_Quotation_${estimateCode}.pdf`;
      pdfMake.createPdf(documentDefinition).download(fileName);
    }
    

}
