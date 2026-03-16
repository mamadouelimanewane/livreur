import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import AdminLayout from './layouts/AdminLayout'
import LoginPage from './pages/auth/LoginPage'

// Dashboard
import DashboardPage from './pages/dashboard/DashboardPage'

// Users
import UsersPage from './pages/users/UsersPage'

// Drivers
import DriversPage from './pages/drivers/DriversPage'
import DriverStatusPage from './pages/drivers/DriverStatusPage'
import VehicleBasedDriversPage from './pages/drivers/VehicleBasedDriversPage'
import AddDriverPage from './pages/drivers/AddDriverPage'
import BasicSignupPage from './pages/drivers/BasicSignupPage'
import PendingDriversPage from './pages/drivers/PendingDriversPage'
import RejectedDriversPage from './pages/drivers/RejectedDriversPage'
import TempRejectedDriversPage from './pages/drivers/TempRejectedDriversPage'
import OnlineReportPage from './pages/drivers/OnlineReportPage'
import ExpiringDocsPage from './pages/drivers/ExpiringDocsPage'
import ExpiredDocsPage from './pages/drivers/ExpiredDocsPage'
import VehiclesPage from './pages/drivers/VehiclesPage'
import DriverMapPage from './pages/drivers/DriverMapPage'
import HeatmapPage from './pages/drivers/HeatmapPage'

// Delivery
import ProductsPage from './pages/delivery/ProductsPage'
import RidesPage from './pages/delivery/RidesPage'

// Taxi
import TaxiRidesPage from './pages/taxi/TaxiRidesPage'

// Setup
import CountriesPage from './pages/setup/CountriesPage'
import DocumentsPage from './pages/setup/DocumentsPage'
import ServicesPage from './pages/setup/ServicesPage'
import ZonesPage from './pages/setup/ZonesPage'
import BannersPage from './pages/setup/BannersPage'
import WeightUnitsPage from './pages/setup/WeightUnitsPage'
import MapMarkersPage from './pages/setup/MapMarkersPage'
import PricingParamsPage from './pages/setup/PricingParamsPage'
import PriceCardsPage from './pages/setup/PriceCardsPage'
import PromoCodesPage from './pages/setup/PromoCodesPage'

// Dispatch
import ManualDispatchPage from './pages/dispatch/ManualDispatchPage'

// Support
import SosPage from './pages/support/SosPage'
import SosRequestsPage from './pages/support/SosRequestsPage'
import CustomerServicePage from './pages/support/CustomerServicePage'

// Content
import PagesPage from './pages/content/PagesPage'
import CmsPage from './pages/content/CmsPage'
import AppStringsPage from './pages/content/AppStringsPage'
import AppStringsV2Page from './pages/content/AppStringsV2Page'
import AdminStringsPage from './pages/content/AdminStringsPage'
import PaymentOptionsPage from './pages/content/PaymentOptionsPage'
import PromotionsPage from './pages/content/PromotionsPage'
import WalletRechargePage from './pages/content/WalletRechargePage'

// Transactions
import CashoutPage from './pages/transactions/CashoutPage'

// Settings
import AdminsPage from './pages/settings/AdminsPage'
import RolesPage from './pages/settings/RolesPage'
import GeneralSettingsPage from './pages/settings/GeneralSettingsPage'
import BookingConfigPage from './pages/settings/BookingConfigPage'
import DriverConfigPage from './pages/settings/DriverConfigPage'
import EmailConfigPage from './pages/settings/EmailConfigPage'
import EmailTemplatePage from './pages/settings/EmailTemplatePage'
import ServiceTypePage from './pages/settings/ServiceTypePage'
import NavigationDrawerPage from './pages/settings/NavigationDrawerPage'
import AppUrlPage from './pages/settings/AppUrlPage'
import PushNotificationsPage from './pages/settings/PushNotificationsPage'
import CancelReasonsPage from './pages/settings/CancelReasonsPage'
import PaymentMethodPage from './pages/settings/PaymentMethodPage'

// Mobile Apps
import MobileUserApp from './pages/mobile/MobileUserApp'
import MobileDriverApp from './pages/mobile/MobileDriverApp'

/* ─────────────────────────────────────────────────
   Protected route wrapper
───────────────────────────────────────────────── */
function RequireAuth({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Mobile Apps (standalone, no admin layout) */}
      <Route path="/mobile/user" element={<MobileUserApp />} />
      <Route path="/mobile/driver" element={<MobileDriverApp />} />

      {/* Protected – all inside AdminLayout */}
      <Route
        element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }
      >
        {/* Dashboard */}
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Users */}
        <Route path="/users" element={<UsersPage />} />

        {/* Drivers */}
        <Route path="/drivers/all"           element={<DriversPage />} />
        <Route path="/drivers/status"        element={<DriverStatusPage />} />
        <Route path="/drivers/vehicle-based" element={<VehicleBasedDriversPage />} />
        <Route path="/drivers/add"           element={<AddDriverPage />} />
        <Route path="/drivers/basic-signup"  element={<BasicSignupPage />} />
        <Route path="/drivers/pending"       element={<PendingDriversPage />} />
        <Route path="/drivers/rejected"      element={<RejectedDriversPage />} />
        <Route path="/drivers/temp-rejected" element={<TempRejectedDriversPage />} />
        <Route path="/drivers/online-report" element={<OnlineReportPage />} />
        <Route path="/drivers/expiring-docs" element={<ExpiringDocsPage />} />
        <Route path="/drivers/expired-docs"  element={<ExpiredDocsPage />} />
        <Route path="/drivers/vehicles"      element={<VehiclesPage />} />
        <Route path="/drivers/map"           element={<DriverMapPage />} />
        <Route path="/drivers/heatmap"       element={<HeatmapPage />} />

        {/* Delivery */}
        <Route path="/delivery/products"             element={<ProductsPage />} />
        <Route path="/delivery/rides/active"         element={<RidesPage type="active" />} />
        <Route path="/delivery/rides/completed"      element={<RidesPage type="completed" />} />
        <Route path="/delivery/rides/cancelled"      element={<RidesPage type="cancelled" />} />
        <Route path="/delivery/rides/failed"         element={<RidesPage type="failed" />} />
        <Route path="/delivery/rides/auto-cancelled" element={<RidesPage type="auto-cancelled" />} />
        <Route path="/delivery/rides/all"            element={<RidesPage type="all" />} />

        {/* Taxi */}
        <Route path="/taxi/rides/active"         element={<TaxiRidesPage type="active" />} />
        <Route path="/taxi/rides/completed"      element={<TaxiRidesPage type="completed" />} />
        <Route path="/taxi/rides/cancelled"      element={<TaxiRidesPage type="cancelled" />} />
        <Route path="/taxi/rides/failed"         element={<TaxiRidesPage type="failed" />} />
        <Route path="/taxi/rides/auto-cancelled" element={<TaxiRidesPage type="auto-cancelled" />} />
        <Route path="/taxi/rides/all"            element={<TaxiRidesPage type="all" />} />

        {/* Setup */}
        <Route path="/setup/countries"      element={<CountriesPage />} />
        <Route path="/setup/documents"      element={<DocumentsPage />} />
        <Route path="/setup/services"       element={<ServicesPage />} />
        <Route path="/setup/zones"          element={<ZonesPage />} />
        <Route path="/setup/banners"        element={<BannersPage />} />
        <Route path="/setup/weight-units"   element={<WeightUnitsPage />} />
        <Route path="/setup/map-markers"    element={<MapMarkersPage />} />
        <Route path="/setup/pricing-params" element={<PricingParamsPage />} />
        <Route path="/setup/pricecards"     element={<PriceCardsPage />} />
        <Route path="/setup/promo-codes"    element={<PromoCodesPage />} />

        {/* Dispatch */}
        <Route path="/dispatch/manual" element={<ManualDispatchPage />} />

        {/* Support */}
        <Route path="/support/sos"              element={<SosPage />} />
        <Route path="/support/sos-requests"     element={<SosRequestsPage />} />
        <Route path="/support/customer-service" element={<CustomerServicePage />} />

        {/* Content */}
        <Route path="/content/pages"           element={<PagesPage />} />
        <Route path="/content/cms"             element={<CmsPage />} />
        <Route path="/content/app-strings"     element={<AppStringsPage />} />
        <Route path="/content/app-strings-v2"  element={<AppStringsV2Page />} />
        <Route path="/content/admin-strings"   element={<AdminStringsPage />} />
        <Route path="/content/payment-options" element={<PaymentOptionsPage />} />
        <Route path="/content/promotions"      element={<PromotionsPage />} />
        <Route path="/content/wallet-recharge" element={<WalletRechargePage />} />

        {/* Transactions */}
        <Route path="/transactions/cashout" element={<CashoutPage />} />

        {/* Settings */}
        <Route path="/settings/admins"             element={<AdminsPage />} />
        <Route path="/settings/roles"              element={<RolesPage />} />
        <Route path="/settings/general"            element={<GeneralSettingsPage />} />
        <Route path="/settings/booking"            element={<BookingConfigPage />} />
        <Route path="/settings/driver"             element={<DriverConfigPage />} />
        <Route path="/settings/email"              element={<EmailConfigPage />} />
        <Route path="/settings/email-template"     element={<EmailTemplatePage />} />
        <Route path="/settings/service-type"       element={<ServiceTypePage />} />
        <Route path="/settings/navigation-drawer"  element={<NavigationDrawerPage />} />
        <Route path="/settings/app-url"            element={<AppUrlPage />} />
        <Route path="/settings/push-notifications" element={<PushNotificationsPage />} />
        <Route path="/settings/cancel-reasons"     element={<CancelReasonsPage />} />
        <Route path="/settings/payment-method"     element={<PaymentMethodPage />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  )
}
