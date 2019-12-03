const PROTOCOL = 'http';
const IP = 'localhost';
const PORT = '8000';
export const BASE_URL = `${PROTOCOL}://${IP}:${PORT}`;

export const READ_SEARCHES = BASE_URL + '/searches';
export const CREATE_SEARCH = BASE_URL + '/searches/search/';