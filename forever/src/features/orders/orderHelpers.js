export const initialOrderForm = {
    shippingStreet: "",
    shippingCity: "",
    shippingState: "",
    shippingZipCode: "",
    shippingCountry: "",
    billingStreet: "",
    billingCity: "",
    billingState: "",
    billingZipCode: "",
    billingCountry: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    notes: "",
};

export const buildOrderPayload = (form, paymentMethod, billingSameAsShipping) => {
    const shippingAddress = {
        street: form.shippingStreet,
        city: form.shippingCity,
        state: form.shippingState,
        zipCode: form.shippingZipCode,
        country: form.shippingCountry,
    };

    const billingAddress = billingSameAsShipping
        ? shippingAddress
        : {
            street: form.billingStreet,
            city: form.billingCity,
            state: form.billingState,
            zipCode: form.billingZipCode,
            country: form.billingCountry,
        };

    return {
        shippingAddress,
        billingAddress,
        paymentMethod,
        notes: form.notes ?? "",
    };
};

export const validateOrderForm = (form, paymentMethod, billingSameAsShipping) => {
    const requiredShipping = [
        form.shippingStreet,
        form.shippingCity,
        form.shippingState,
        form.shippingZipCode,
        form.shippingCountry,
    ];

    const requiredContact = [form.firstName, form.lastName, form.email, form.phone];
    const requiredBilling = billingSameAsShipping
        ? []
        : [
            form.billingStreet,
            form.billingCity,
            form.billingState,
            form.billingZipCode,
            form.billingCountry,
        ];

    const required = [...requiredShipping, ...requiredContact, ...requiredBilling, paymentMethod];
    return required.every((value) => String(value ?? "").trim().length > 0);
};
