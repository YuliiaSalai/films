import api from "api";
import { prop, sortWith, ascend, descend } from "ramda";
import _find from "lodash/find";
import { useQuery, useMutation, useQueryClient } from "react-query";

const sortFilms = (films) =>
  sortWith([descend(prop("featured")), ascend(prop("title"))], films);

export function useLoadFilms() {
  const queryClient = useQueryClient();

  return useQuery("films", async () => {
    const films = await api.films.fetchAll();
    films.map((film) => queryClient.setQueryData(["films", film._id], film));
    return sortFilms(films);
  });
}

function saveFilm(filmData) {
  return filmData._id ? api.films.update(filmData) : api.films.create(filmData);
}

const defaultMutationOptions = (queryClient) => ({
  onMutate: async (newItem) => {
    const prevItem = queryClient.getQueryData("films");

    if (newItem._id) {
      queryClient.setQueryData(["films", newItem._id], newItem);

      queryClient.setQueryData("films", (old) => {
        const newFilms = newItem._id
          ? old.map((f) => (f._id === newItem._id ? { ...f, ...newItem } : f))
          : [...old, newItem];
        return sortFilms(newFilms);
      });
    } else {
      const addedItem = { ...newItem, _id: "added" };
      queryClient.setQueryData("films", (old) => [...old, addedItem]);
    }
    return { prevItem };
  },

  onError: (err, newItem, context) => {
    queryClient.setQueryData("films", context.prevItem);
  },

  onSettled: (newItem) => {
    queryClient.invalidateQueries("films");
  },
});

export function useSaveFilm() {
  const queryClient = useQueryClient();

  return useMutation((filmData) => saveFilm(filmData), {
    ...defaultMutationOptions(queryClient),
  });
}

export function useEditFilm(_id) {
  const queryClient = useQueryClient();
  const films = queryClient.getQueryData("films");
  return _find(films, { _id }) || {};
}

export function useToggleFeatured() {
  const queryClient = useQueryClient();
  return useMutation((film) => api.films.update(film), {
    ...defaultMutationOptions(queryClient),
  });
}

export function useDeleteFilm() {
  const queryClient = useQueryClient();

  return useMutation((film) => api.films.delete(film), {
    ...defaultMutationOptions(queryClient),
    onMutate(deletedFilm) {
      const previousFilm = queryClient.getQueryData("films");
      queryClient.removeQueries({ queryKey: ["films", deletedFilm._id] });
      queryClient.setQueryData("films", (old) => {
        const newFilms = old.filter((item) => item._id !== deletedFilm._id);
        return sortFilms(newFilms);
      });
      return { previousFilm };
    },
  });
}

export function useFetchFilm(id) {
  return useQuery(["films", id], async () => {
    return await api.films.fetchById(id);
  });
}
