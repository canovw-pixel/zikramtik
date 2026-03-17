import React, { useRef } from 'react';
import Barcode from 'react-barcode';
import { X, Printer } from 'lucide-react';
import { Button } from './ui/button';

const ShippingLabel = ({ order, onClose }) => {
  const labelRef = useRef(null);

  const handlePrint = () => {
    const content = labelRef.current;
    if (!content) return;

    const printWindow = window.open('', '_blank', 'width=600,height=800');
    printWindow.document.write(`
      <html>
        <head>
          <title>Kargo Etiketi - ${order.order_number}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; padding: 16px; }
            .label { border: 2px solid #000; padding: 20px; max-width: 400px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 12px; }
            .brand { font-size: 20px; font-weight: bold; letter-spacing: 2px; }
            .sub { font-size: 10px; color: #666; margin-top: 2px; }
            .section { margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px dashed #ccc; }
            .section:last-of-type { border-bottom: none; }
            .section-title { font-size: 9px; font-weight: bold; text-transform: uppercase; color: #666; margin-bottom: 4px; letter-spacing: 1px; }
            .address { font-size: 14px; line-height: 1.5; }
            .address .name { font-size: 16px; font-weight: bold; }
            .order-info { display: flex; justify-content: space-between; font-size: 12px; }
            .order-info .label-text { color: #666; }
            .order-info .value { font-weight: bold; }
            .cargo-info { background: #f5f5f5; padding: 10px; border-radius: 4px; text-align: center; }
            .cargo-company { font-size: 16px; font-weight: bold; }
            .tracking { font-size: 14px; margin-top: 4px; }
            .barcode-container { text-align: center; margin-top: 12px; }
            .barcode-container svg { max-width: 100%; }
            .products { font-size: 11px; }
            .products .item { display: flex; justify-content: space-between; padding: 2px 0; }
            @media print {
              body { padding: 0; }
              .no-print { display: none !important; }
            }
          </style>
        </head>
        <body>
          ${content.innerHTML}
          <div style="text-align:center;margin-top:16px;" class="no-print">
            <button onclick="window.print()" style="padding:10px 30px;font-size:14px;cursor:pointer;background:#000;color:#fff;border:none;border-radius:4px;">Yazdir</button>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" data-testid="label-modal">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold text-gray-900">Kargo Etiketi</h2>
          <div className="flex items-center gap-2">
            <Button onClick={handlePrint} size="sm" className="bg-gray-900 hover:bg-gray-800 text-white flex items-center space-x-1" data-testid="print-label-btn">
              <Printer className="w-4 h-4" /><span>Yazdir</span>
            </Button>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="p-6">
          <div ref={labelRef}>
            <div className="label" style={{ border: '2px solid #000', padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
              {/* Header */}
              <div style={{ textAlign: 'center', borderBottom: '2px solid #000', paddingBottom: '12px', marginBottom: '12px' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', letterSpacing: '2px' }}>CRAPONIA ATELIER</div>
                <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>Zikra Collection</div>
              </div>

              {/* Sender */}
              <div style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px dashed #ccc' }}>
                <div style={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', color: '#666', marginBottom: '4px', letterSpacing: '1px' }}>Gonderen</div>
                <div style={{ fontSize: '12px', lineHeight: '1.4' }}>
                  <div style={{ fontWeight: 'bold' }}>Craponia Atelier</div>
                </div>
              </div>

              {/* Recipient */}
              <div style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px dashed #ccc' }}>
                <div style={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', color: '#666', marginBottom: '4px', letterSpacing: '1px' }}>Alici</div>
                <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
                  <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{order.shipping_address?.full_name}</div>
                  <div>{order.shipping_address?.address}</div>
                  <div>{order.shipping_address?.city} {order.shipping_address?.zip_code}</div>
                  <div>{order.shipping_address?.country}</div>
                  <div style={{ fontWeight: 'bold', marginTop: '4px' }}>Tel: {order.shipping_address?.phone}</div>
                </div>
              </div>

              {/* Order Info */}
              <div style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px dashed #ccc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span style={{ color: '#666' }}>Siparis No:</span>
                  <span style={{ fontWeight: 'bold' }}>{order.order_number}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: '#666' }}>Tutar:</span>
                  <span style={{ fontWeight: 'bold' }}>{order.currency} {order.total_amount?.toLocaleString()}</span>
                </div>
              </div>

              {/* Products */}
              <div style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px dashed #ccc' }}>
                <div style={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', color: '#666', marginBottom: '4px', letterSpacing: '1px' }}>Urunler</div>
                {order.products?.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', padding: '2px 0' }}>
                    <span>{item.name} x{item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Cargo Info */}
              {order.tracking_number && (
                <div style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px', textAlign: 'center', marginBottom: '12px' }}>
                  <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{order.cargo_company}</div>
                  <div style={{ fontSize: '14px', marginTop: '4px' }}>{order.tracking_number}</div>
                </div>
              )}

              {/* Barcode */}
              {order.tracking_number && (
                <div style={{ textAlign: 'center' }}>
                  <Barcode
                    value={order.tracking_number}
                    width={1.5}
                    height={50}
                    fontSize={12}
                    margin={0}
                    displayValue={true}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingLabel;
