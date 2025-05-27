import { ref, watch } from "vue";

export default function useTitle(data, pure) {
  const title = ref(data.title || "codepen");
  const author = ref(data.author || "-");
  const date = ref(data.date || "-");

  watch(
    title,
    (newTitle) => {
      if (!pure) document.title = `${newTitle} - codepen`;
    },
    {
      immediate: true,
    }
  );

  function setData(data) {
    title.value = data.title;
    author.value = data.author || "-";
    date.value = data.date || "-";
  }

  return { title, author, date, setData };
}
