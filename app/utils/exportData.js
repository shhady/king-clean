import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

export function exportToExcel(data, filename) {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(dataBlob, `${filename}.xlsx`);
}

export function exportToPDF(data, filename) {
  // Implementation depends on your PDF library choice
  // Example using jsPDF:
  const doc = new jsPDF();
  doc.text(JSON.stringify(data, null, 2), 10, 10);
  doc.save(`${filename}.pdf`);
}

export function prepareDataForExport(analytics, type) {
  switch (type) {
    case 'sales':
      return analytics.salesByDay.labels.map((day, index) => ({
        Day: day,
        Earnings: analytics.salesByDay.earnings[index],
        Costs: analytics.salesByDay.costs[index]
      }));
    case 'categories':
      return Object.entries(analytics.topCategories).map(([category, data]) => ({
        Category: category,
        Percentage: data.value,
        Revenue: data.revenue
      }));
    case 'products':
      return analytics.topProducts.map(product => ({
        Name: product.name,
        Sales: product.sales,
        Revenue: product.revenue,
        Trend: product.trend
      }));
    default:
      return [];
  }
} 