import { useParams } from "react-router-dom";
import { useGetOrderDetailsQuery } from "../redux/api/orderApi";
import { Loader } from "../components/Loader";
import { ErrorState } from "../components/ErrorState";
import PublicNavbar from "../components/PublicNavbar";
import Footer from "../components/Footer";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const STATUS_CONFIG = {
  delivered: { pill: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200", label: "Delivered" },
  cancelled: { pill: "bg-red-50 text-red-600 ring-1 ring-red-200", label: "Cancelled" },
  confirmed: { pill: "bg-blue-50 text-blue-700 ring-1 ring-blue-200", label: "Confirmed" },
  pending:   { pill: "bg-amber-50 text-amber-700 ring-1 ring-amber-200", label: "Pending" },
};

const SectionCard = ({ children, className = "" }) => (
  <div className={`bg-white border border-gray-100 rounded-2xl overflow-hidden ${className}`}>
    {children}
  </div>
);

const SectionHeader = ({ title }) => (
  <div className="px-5 py-4 border-b border-gray-100">
    <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
  </div>
);

const SummaryRow = ({ label, value, highlight, last }) => (
  <div className={`flex items-center justify-between py-2.5 ${last ? "border-t border-gray-100 mt-1 pt-3.5" : ""}`}>
    <span className={`text-sm ${last ? "font-semibold text-gray-900" : "text-gray-500"}`}>{label}</span>
    <span className={`text-sm ${highlight ? "text-emerald-600 font-medium" : last ? "font-semibold text-gray-900" : "text-gray-700 font-medium"}`}>
      {value}
    </span>
  </div>
);

const OrderDetails = () => {
  const { orderId } = useParams();
  const { data, isLoading, isError, refetch } = useGetOrderDetailsQuery(orderId);

  if (isLoading) return <Loader text="Loading order details..." />;
  if (isError) return <ErrorState onRetry={refetch} />;

  const order = data?.order;
  if (!order) return null;

  const statusCfg = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.pending;
  const position = [order.deliveryAddress?.latitude, order.deliveryAddress?.longitude];

  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });
  const formattedTime = new Date(order.createdAt).toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit",
  });

  return (
    <>
      <PublicNavbar />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">

          {/* ── Page header ── */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{order.orderNumber}</h1>
              <p className="text-sm text-gray-400 mt-0.5">{formattedDate} · {formattedTime}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                {order.payment?.method}
              </span>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusCfg.pill}`}>
                {statusCfg.label}
              </span>
            </div>
          </div>

          {/* ── Main grid ── */}
          <div className="grid md:grid-cols-3 gap-5">

            {/* ── Left column ── */}
            <div className="md:col-span-2 space-y-5">

              {/* Items */}
              <SectionCard>
                <SectionHeader title="Items ordered" />
                <div className="divide-y divide-gray-50">
                  {order.items?.map((item) => (
                    <div key={item.foodId} className="flex items-center gap-4 px-5 py-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 rounded-xl object-cover bg-gray-50 shrink-0 border border-gray-100"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Qty {item.quantity} · NPR {item.price?.toLocaleString()} each
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900 shrink-0">
                        NPR {(item.price * item.quantity)?.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </SectionCard>

              {/* Delivery address */}
              <SectionCard>
                <SectionHeader title="Delivery address" />
                <div className="px-5 py-4 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{order.deliveryAddress?.fullName}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{order.deliveryAddress?.phone}</p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {order.deliveryAddress?.street}, {order.deliveryAddress?.city}
                    </p>
                  </div>
                </div>
              </SectionCard>

              {/* Map */}
              <SectionCard>
                <SectionHeader title="Delivery location" />
                <MapContainer
                  center={position}
                  zoom={15}
                  style={{ height: "260px", width: "100%" }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={position} icon={defaultIcon}>
                    <Popup>Delivery location 📍</Popup>
                  </Marker>
                </MapContainer>
              </SectionCard>
            </div>

            {/* ── Right column ── */}
            <div className="space-y-5">

              {/* Payment summary */}
              <SectionCard>
                <SectionHeader title="Order summary" />
                <div className="px-5 py-4">
                  <SummaryRow label="Subtotal" value={`NPR ${order.subTotal?.toLocaleString()}`} />
                  <SummaryRow label="Delivery fee" value={`NPR ${order.deliveryFee?.toLocaleString()}`} />
                  <SummaryRow label="Tax" value={`NPR ${order.tax?.toLocaleString()}`} />
                  {order.discount > 0 && (
                    <SummaryRow
                      label="Discount"
                      value={`-NPR ${order.discount?.toLocaleString()}`}
                      highlight
                    />
                  )}
                  <SummaryRow
                    label="Total"
                    value={`NPR ${order.totalAmount?.toLocaleString()}`}
                    last
                  />
                </div>
              </SectionCard>

              {/* Payment status */}
              <SectionCard>
                <SectionHeader title="Payment" />
                <div className="px-5 py-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Method</span>
                    <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                      {order.payment?.method}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Status</span>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        order.payment?.status === "paid"
                          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                          : "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                      }`}
                    >
                      {order.payment?.status === "paid" ? "Paid" : "Pending"}
                    </span>
                  </div>
                  {order.payment?.paidAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Paid on</span>
                      <span className="text-xs font-medium text-gray-700">
                        {new Date(order.payment.paidAt).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric",
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </SectionCard>

            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default OrderDetails;