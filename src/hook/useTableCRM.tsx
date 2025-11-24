import { useCallback, useEffect, useState } from "react";
import type { APIResult } from "../types/types";

interface UseTableCRMReturn {
  loading: boolean;
  organizations: APIResult;
  payboxes: APIResult;
  warehouses: APIResult;
  priceTypes: APIResult;
  contragents: APIResult;
  nomenclature: APIResult;
}

export function useTableCRM(token: string): UseTableCRMReturn {
  const [loading, setLoading] = useState<boolean>(false);

  const [organizations, setOrganizations] = useState<APIResult>({ result: [] });
  const [payboxes, setPayboxes] = useState<APIResult>({ result: [] });
  const [warehouses, setWarehouses] = useState<APIResult>({ result: [] });
  const [priceTypes, setPriceTypes] = useState<APIResult>({ result: [] });
  const [contragents, setContragents] = useState<APIResult>({ result: [] });
  const [nomenclature, setNomenclature] = useState<APIResult>({ result: [] });

  const CORRECT_TOKEN =
    "af1874616430e04cfd4bce30035789907e899fc7c3a1a4bb27254828ff304a77";

  const fetchData = useCallback(
    async (url: string, setter: React.Dispatch<React.SetStateAction<APIResult>>) => {
      try {
        const res = await fetch(`${url}?token=${token}`);
        const { result }: APIResult = await res.json();
        setter({ result: result });
      } catch (e) {
        console.error(e);
      }
    },
    [token]
  );

  useEffect(() => {
    if (!token || token !== CORRECT_TOKEN) return;

    async function loadAll() {
      setLoading(true);

      await Promise.all([
        fetchData("https://app.tablecrm.com/api/v1/organizations/", setOrganizations),
        fetchData("https://app.tablecrm.com/api/v1/payboxes/", setPayboxes),
        fetchData("https://app.tablecrm.com/api/v1/warehouses/", setWarehouses),
        fetchData("https://app.tablecrm.com/api/v1/price_types/", setPriceTypes),
        fetchData("https://app.tablecrm.com/api/v1/contragents/", setContragents),
        fetchData("https://app.tablecrm.com/api/v1/nomenclature/", setNomenclature)
      ]);

      setLoading(false);
    }

    loadAll();
  }, [token, fetchData]);

  return {
    loading,
    organizations,
    payboxes,
    warehouses,
    priceTypes,
    contragents,
    nomenclature
  };
}