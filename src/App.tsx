import { useState } from 'react';
import './App.css';
import FormTablSRM from './components/page/form';
import { useTableCRM } from './hook/useTableCRM';

function App() {
  const [token, setToken] = useState("");
    
  const {
      loading,
      organizations,
      payboxes,
      warehouses,
      priceTypes,
      contragents,
      nomenclature
    } = useTableCRM(token);

  return (
    <FormTablSRM 
      token={token}
      setToken={setToken}
      payboxes={payboxes}
      warehouses={warehouses}
      priceTypes={priceTypes}
      contragents={contragents}
      organizations={organizations}
      nomenclature={nomenclature}
      loading={loading}
    />
  )
}

export default App
