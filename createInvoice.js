const fs = require("fs");
const PDFDocument = require("pdfkit");

function createInvoice(invoice, path) {
  let doc = new PDFDocument({ size: "A4", margin: 50 });

  generateHeader(doc);
  generateCustomerInformation(doc, invoice);
  generateInvoiceTable(doc, invoice);
  generateFooter(doc, invoice);

  doc.end();
  doc.pipe(fs.createWriteStream(path));
}

function generateHeader(doc) {
  doc
    .image("logo.png", 50, 45, { width: 50 })
    .fillColor("#444444")
    .fontSize(20)
    .text("Foodify9ja", 110, 57)
    .fontSize(10)
    .text("Foodify9ja", 200, 50, { align: "right" })
    .text("17 Jaiyeola Abidoye Street", 200, 65, { align: "right" })
    .text("Divine Homes Estate, Ajah, Lekki, 106104, Lagos", 200, 80, { align: "right" })
    .moveDown();
}

function generateCustomerInformation(doc, invoice) {
  doc
    .fillColor("#444444")
    .fontSize(20)
    .text("Invoice", 50, 160);

  generateHr(doc, 185);

  const customerInformationTop = 200;

  doc
    .fontSize(10)
    .text("Invoice Number:", 50, customerInformationTop)
    .font("Helvetica-Bold")
    .text(invoice.invoice_nr, 150, customerInformationTop)
    .font("Helvetica")
    .text("Issued On:", 50, customerInformationTop + 15)
    .text(formatDate(new Date()), 150, customerInformationTop + 15)
    .text("Status :", 50, customerInformationTop + 30)
    .font("Helvetica-Bold")
    .text(
      "Pending",
      150,
      customerInformationTop + 30
    )

    .font("Helvetica-Bold")
    .text(invoice.shipping.name, 300, customerInformationTop)
    .font("Helvetica")
    .text(invoice.shipping.address, 300, customerInformationTop + 15)
    .text(
      invoice.shipping.city +
        ", " +
        invoice.shipping.state +
        ", " +
        invoice.shipping.country,
      300,
      customerInformationTop + 30
    )
    .moveDown();

  generateHr(doc, 252);
}

function generateInvoiceTable(doc, invoice) {
  let i;
  const invoiceTableTop = 330;

  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    "Item",
    "Description",
    "Unit Cost",
    "Quantity",
    "Line Total"
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Helvetica");

  for (i = 0; i < invoice.items.length; i++) {
    const item = invoice.items[i];
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      item.item,
      item.description,
      formatCurrency(item.amount / item.quantity),
      item.quantity,
      formatCurrency(item.amount)
    );

    generateHr(doc, position + 20);
  }

  const subtotalPosition = invoiceTableTop + (i + 1) * 30;
  generateTableRow(
    doc,
    subtotalPosition,
    "",
    "",
    "Subtotal",
    "",
    formatCurrency(invoice.subtotal)
  );

  const deliveryFeePosition = subtotalPosition + 20;
  generateTableRow(
    doc,
    deliveryFeePosition,
    "",
    "",
    "Delivery Fee",
    "",
    formatCurrency(invoice.delivery_fee)
  );

  const vatPosition = deliveryFeePosition + 20;
  generateTableRow(
    doc,
    vatPosition,
    "",
    "",
    "VAT",
    "",
    formatCurrency(invoice.vat)
  );

  const duePosition = vatPosition + 25;
  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    duePosition,
    "",
    "",
    "Total",
    "",
    formatCurrency(invoice.subtotal + invoice.delivery_fee + invoice.vat)
  );
  doc.font("Helvetica");
}

function generateFooter(doc, invoice) {
  doc
    .fontSize(10)
    .text(
      `To pay for this invoice, visit https://paystack.com/pay/${invoice.request_code}`,
      50,
      780,
      { align: "center", width: 500 }
    );
}

function generateTableRow(
  doc,
  y,
  item,
  description,
  unitCost,
  quantity,
  lineTotal
) {
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(description, 150, y)
    .text(unitCost, 280, y, { width: 90, align: "right" })
    .text(quantity, 370, y, { width: 90, align: "right" })
    .text(lineTotal, 0, y, { align: "right" });
}

function generateHr(doc, y) {
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();
}

function formatCurrency(cents) {
  return "NGN " + (cents).toFixed(2);
}

function formatDate(date) {
 // const day = date.getDate();
 // const month = date.getMonth() + 1;
 // const year = date.getFullYear();
  const formatedDate = date.toDateString()
  const formatter = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const formattedTime = formatter.format(date);
 // console.log(formattedTime);
 // return year + "/" + month + "/" + day;
 return formatedDate + " " + formattedTime;

}

module.exports = {
    createInvoice
  };