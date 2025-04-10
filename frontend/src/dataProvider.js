import { fetchUtils } from "react-admin";

const apiUrl = "/";
const httpClient = fetchUtils.fetchJson;

export const provider = {
  getList: async (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const filter = params.filter;

    // Construimos la query string con filtros y paginación
    const query = {
      _sort: field,
      _order: order,
      _start: (page - 1) * perPage,
      _end: page * perPage,
      ...filter,
    };

    const url = `${apiUrl}/${resource}?${fetchUtils.queryParameters(query)}`;

    const { headers, json } = await httpClient(url);

    return {
      data: json,
      total: json.length || parseInt(headers.get("X-Total-Count"), 10),
    };
  },

  // Puedes agregar otros métodos como getOne, create, update, delete, etc.
};
