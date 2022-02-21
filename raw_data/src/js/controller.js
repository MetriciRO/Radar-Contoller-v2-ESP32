import 'core-js/stable';
import 'regenerator-runtime/runtime';

const getData = async function () {
  try {
    const res = await fetch(
      'https://mocki.io/v1/4f35e17d-f292-4e32-bf8c-d837fb16de1e'
    );
    const data = await res.json();

    console.log(res, data);
  } catch (error) {
    console.log(error);
  }
};

getData();
