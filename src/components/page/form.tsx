import { AutoComplete, Button, Form, Input, Select } from "antd";
import { useState } from "react";
import { getOptions, LABLES } from "../const/lables";
import type { APIResult, DataItem } from "../../types/types";

interface FormTablSRMProps {
    token: string;
    setToken: (token: string) => void;
    payboxes: APIResult;
    warehouses: APIResult;
    priceTypes: APIResult;
    contragents: APIResult;
    organizations: APIResult;
    nomenclature: APIResult;
    loading: boolean;
}

interface SelectValues {
    [key: string]: string | number | undefined;
}

interface PayloadGoods {
    nomenclature: string;
    quantity: number;
    price: number;
}

interface Payload {
    operation: string;
    contragent: number;
    organization?: string | number;
    warehouse?: string | number;
    price_type?: string | number | null;
    goods: PayloadGoods[];
}

function FormTablSRM({
    token,
    setToken,
    payboxes,
    warehouses,
    priceTypes,
    contragents,
    organizations,
    nomenclature,
    loading
}: FormTablSRMProps) {
    const [inputToken, setInputToken] = useState<string>(token);
    const [selectValues, setSelectValues] = useState<SelectValues>({});

    const selectDataMap: Record<string, APIResult> = {
        "Контрагент (поиск по телефону)": contragents,
        "Счёт поступления": payboxes,
        "Склад отгрузки": warehouses,
        "Организация": organizations,
        "Тип цены": priceTypes,
        "Поиск товара": nomenclature
    };

    const handleSubmitToken = () => {
        setToken(inputToken);
    };

    const handleChange = (label: string, value: string | number) => {
        if (label === "Контрагент (поиск по телефону)") {
            if (value && !/^\d+$/.test(String(value))) {
                return;
            }
        }
        
        setSelectValues(prev => ({
            ...prev,
            [label]: value
        }));
    };

    const isSearchable = (label: string) =>
        label === "Контрагент (поиск по телефону)" || label === "Поиск товара";

    const buildPayload = (): Payload[] => {
        const contragent = selectValues["Контрагент (поиск по телефону)"];
        const nomenclature = selectValues["Поиск товара"];
        
        const contragentId = typeof contragent === 'number' ? contragent : parseInt(String(contragent));

        return [{
            operation: "Заказ",
            contragent: contragentId,
            organization: selectValues["Организация"],
            warehouse: selectValues["Склад отгрузки"],
            price_type: selectValues["Тип цены"] || null,
            goods: [
                {
                    nomenclature: String(nomenclature),
                    quantity: 1,
                    price: 0
                }
            ]
        }];
    };

    const validateFields = (): boolean => {
        const contragent = selectValues["Контрагент (поиск по телефону)"];
        const nomenclature = selectValues["Поиск товара"];
        
        const contragentNum = typeof contragent === 'number' ? contragent : parseInt(String(contragent));
        if (isNaN(contragentNum)) {
            alert("Контрагент должен быть выбран из списка или введён как ID (число)");
            return false;
        }
        
        if (!nomenclature) {
            alert("Товар должен быть выбран из списка или введён как ID");
            return false;
        }
        
        return true;
    };

    const sendOrder = async (conduct = false) => {
        if (!token) {
            alert("Введите токен!");
            return;
        }

        if (!allFilled) {
            alert("Пожалуйста, заполните все поля!");
            return;
        }

        if (!validateFields()) {
            return;
        }

        const payload = buildPayload();
        console.log("Отправляемый payload:", payload);
        
        const url = `https://app.tablecrm.com/api/v1/docs_sales/?token=${token}`;

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            console.log("Ответ сервера:", data);

            if (!res.ok) {
                alert(`Ошибка ${res.status}: ${JSON.stringify(data)}`);
                return;
            }

            alert(conduct ? "Продажа создана и проведена!" : "Продажа создана!");
            
            setSelectValues({});
        } catch (e) {
            console.error(e);
            alert("Ошибка отправки данных!");
        }
    };

    const allFilled = LABLES.every(label => Boolean(selectValues[label]));

    return (
        <Form
            layout="vertical"
            style={{
                maxWidth: 600,
                minWidth: 450,
                backgroundColor: "#fff",
                padding: "7px 20px",
                borderRadius: "15px"
            }}
            size="middle"
        >
            <Form.Item label="Токен">
                <Input
                    value={inputToken}
                    onChange={(e) => setInputToken(e.target.value)}
                />
            </Form.Item>
            <Form.Item>
                <Button
                    type="primary"
                    style={{ width: "50%" }}
                    onClick={handleSubmitToken}
                >
                    отправить токен
                </Button>
            </Form.Item>

            {LABLES.map((label) => {
                const raw = selectDataMap[label];
                const dataArray: DataItem[] = raw?.result || [];
                
                const options = getOptions(dataArray);

                if (isSearchable(label)) {
                    return (
                        <Form.Item label={label} key={label}>
                            <AutoComplete
                                value={selectValues[label]}
                                onChange={(value) => handleChange(label, value)}
                                placeholder="Введите или выберите"
                                style={{ width: "100%" }}
                                options={options}
                                filterOption={(input, option) =>
                                    (option?.label ?? "")
                                        .toLowerCase()
                                        .includes(input.toLowerCase())
                                }
                                disabled={loading}
                            />
                        </Form.Item>
                    );
                }

                return (
                    <Form.Item label={label} key={label}>
                        <Select
                            loading={loading}
                            value={selectValues[label]}
                            onChange={(value) => handleChange(label, value)}
                            placeholder="Выберите"
                            style={{ width: "100%" }}
                            dropdownStyle={{ color: "#000" }}
                        >
                            {options.map((item) => (
                                <Select.Option
                                    key={item.value}
                                    value={item.value}
                                >
                                    {item.label}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                );
            })}

            <Form.Item>
                <Button
                    type="primary"
                    style={{ width: "50%" }}
                    onClick={() => sendOrder(false)}
                >
                    Создать продажу
                </Button>
            </Form.Item>

            <Form.Item>
                <Button
                    style={{ width: "50%" }}
                    disabled={!allFilled}
                    onClick={() => sendOrder(true)}
                >
                    Создать и провести
                </Button>
            </Form.Item>
        </Form>
    );
}

export default FormTablSRM;