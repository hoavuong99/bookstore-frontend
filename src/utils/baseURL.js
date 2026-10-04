const getBaseUrl = () => {
    return import.meta.env.VITE_API_ORIGIN || "";
}

export default getBaseUrl;