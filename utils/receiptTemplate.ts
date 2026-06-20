// utils/receiptTemplate.ts
export const generateReceiptHTML = (
  receiptData: any,
  t: (key: string) => string
) => {
  const formatCurrency = (v: number) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
    }).format(v);

  // 🧾 Balance Info
  let balanceInfo = "";
  const paid = receiptData.paymentAmount ?? 0;
  const total = receiptData.total ?? 0;
  const diff = paid - total;

  if (diff < 0) {
    balanceInfo = `
      <p style="color:#d97706; margin:2px 0; text-align:right;">
        <strong>${t("remaining")}:</strong> ${formatCurrency(Math.abs(diff))}
      </p>`;
  } else if (diff > 0) {
    balanceInfo = `
      <p style="color:#16a34a; margin:2px 0; text-align:right;">
        <strong>${t("advance")}:</strong> ${formatCurrency(diff)}
      </p>`;
  } else {
    balanceInfo = `
      <p style="color:#2563eb; margin:2px 0; text-align:right;">
        <strong>${t("fullyPaid")}</strong>
      </p>`;
  }

  const logoUrl = "/logo.jpg";

  // 🧾 Final Receipt Layout
  return `
  <div style="
    font-family: Arial, sans-serif;
    font-size: 13px;
    color: #111;
    background: #fff;
    padding: 5px;
    border-radius: 10px;
    width: 100%;
  ">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 15px;">
      <img src="${logoUrl}" alt="Company Logo" style="height: 70px; margin-bottom: 5px;" />
      <h2 style="margin: 5px 0; font-size: 18px; color: #222;">BAHOO STEEL INDUSTRY</h2>
      <p style="margin: 0;">Noshara Road, Gujranwala</p>
      <p style="margin: 0;">0300-6103872</p>
      <h3 style="margin-top: 6px; font-size: 16px; color: #2563eb;">${t(
        "salesReceipt"
      )}</h3>
    </div>

    <!-- Info Section -->
    <table style="width: 100%; margin-bottom: 10px;">
      <tr>
        <td><strong>${t("receiptNo")}:</strong> ${receiptData.id}</td>
        <td style="text-align: right;"><strong>${t(
          "date"
        )}:</strong> ${new Date(receiptData.date).toLocaleString()}</td>
      </tr>
      <tr>
        <td><strong>${t("customer")}:</strong> ${
    receiptData.customer?.name || t("walkIn")
  }</td>
        <td style="text-align: right;"><strong>${t("parcelNo")}:</strong> ${
    receiptData?.parcelNumber || "-"
  }</td>
      </tr>
    </table>

    <!-- Items Table -->
    <table style="
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #ddd;
      border-radius: 6px;
      overflow: hidden;
    ">
      <thead style="background: #f8fafc; color: #111;">
        <tr>
          <th style="padding: 8px; border: 1px solid #ddd;">${t("item")}</th>
          <th style="padding: 8px; border: 1px solid #ddd;">${t("qty")}</th>
          <th style="padding: 8px; border: 1px solid #ddd;">${t("price")}</th>
          <th style="padding: 8px; border: 1px solid #ddd;">${t("total")}</th>
        </tr>
      </thead>
      <tbody>
        ${receiptData.items
          .map(
            (i: any) => `
            <tr>
              <td style="padding: 6px; border: 1px solid #ddd;">${i.name}</td>
              <td style="padding: 6px; border: 1px solid #ddd; text-align: center;">${
                i.quantity
              }</td>
              <td style="padding: 6px; border: 1px solid #ddd; text-align: right;">${formatCurrency(
                i.unitPrice
              )}</td>
              <td style="padding: 6px; border: 1px solid #ddd; text-align: right;">${formatCurrency(
                i.total
              )}</td>
            </tr>`
          )
          .join("")}
      </tbody>
    </table>

    <!-- Totals -->
    <div style="margin-top: 15px; text-align: right;">
      <p><strong>${t("subtotal")}:</strong> ${formatCurrency(
    receiptData.subtotal
  )}</p>
      ${
        receiptData.discountAmount > 0
          ? `<p><strong>${t("discount")}:</strong> -${formatCurrency(
              receiptData.discountAmount
            )}</p>`
          : ""
      }
      ${
        receiptData.taxAmount > 0
          ? `<p><strong>${t("tax")}:</strong> ${formatCurrency(
              receiptData.taxAmount
            )}</p>`
          : ""
      }
      <p style="font-size: 15px; font-weight: bold; border-top: 1px solid #ccc; padding-top: 6px; margin-top: 8px;">
        ${t("total")}: ${formatCurrency(receiptData.total)}
      </p>

      <p><strong>${t("paymentMethod")}:</strong> ${
    receiptData.paymentMethod?.name || "-"
  }</p>
      <p><strong>${t("amountPaid")}:</strong> ${formatCurrency(paid)}</p>
      <p><strong>${t("change")}:</strong> ${formatCurrency(
    receiptData.change ?? 0
  )}</p>

      ${balanceInfo}
    </div>

    <!-- Footer -->
    <div style="text-align: center; border-top: 1px solid #ddd; margin-top: 15px; padding-top: 8px;">
      <p style="margin: 2px 0;">${t("thankYou")}</p>
    </div>
  </div>
  `;
};
