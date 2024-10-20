// context/empContext.js
'use client';

import { createContext, useState } from "react";

const EmpContext = createContext();

export const EmpProvider = ({ children }) => {
    let empresa = null;

    if (typeof localStorage !== "undefined") {
        empresa = JSON.parse(localStorage.getItem("empresa"));
    }

    const [emp, setEmp] = useState(empresa);

    return (
        <EmpContext.Provider value={{ emp, setEmp }}>
            {children}
        </EmpContext.Provider>
    );
};

export default EmpContext;

