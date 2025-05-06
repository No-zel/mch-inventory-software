export function dateFormat(data) {
    const date = new Date(data);

    const formattedDate = date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      return formattedDate;
}