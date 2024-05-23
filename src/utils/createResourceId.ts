const createResourceID = (): string => {
    const arr = new Uint8Array(12);
    window.crypto.getRandomValues(arr);
    return Array.from(arr, (v) => v.toString(16).padStart(1, '0')).join('');
};

export default createResourceID;
