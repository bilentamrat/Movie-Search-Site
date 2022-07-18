function resetError() {
  document.getElementById('searchKeyErr').innerHTML = '';
  document.getElementById('searchYearErr').innerHTML = '';
  document.getElementById('plotErr').innerHTML = '';
}
// form vaildation
function validateForm() {
  let errorFound = false;
  resetError();
  const d = new Date();
  const currYear = d.getFullYear();
  const minYear = 1928;
  let qparams = '';
  const searchKey = document.forms['formSearchMovie']['searchKey'].value;
  if (searchKey.length === 0) {
    errorFound = true;
    document.getElementById('searchKeyErr').innerHTML =
      'Please enter movie title';
  } else {
    qparams = 't=' + searchKey;
  }

  const searchYear = document.forms['formSearchMovie']['searchYear'].value;
  if (searchYear.length > 0) {
    if (parseInt(searchYear) > 0) {
      if (parseInt(searchYear) < minYear) {
        errorFound = true;
        document.getElementById(
          'searchYearErr'
        ).innerHTML = `Year must be in range of [${minYear} - ${currYear}]`;
      } else if (parseInt(searchYear) > currYear) {
        errorFound = true;
        document.getElementById(
          'searchYearErr'
        ).innerHTML = `Year must be in range of [${minYear} - ${currYear}]`;
      } else {
        qparams = qparams + '&y=' + searchYear;
      }
    } else {
      errorFound = true;
      document.getElementById('searchYearErr').innerHTML =
        'Please enter valid year';
    }
  }

  const plot = document.querySelector('input[name="plot"]:checked');
  if (plot != null) {
    qparams = qparams + '&plot=' + plot.defaultValue;
  } else {
    errorFound = true;
    document.getElementById('plotErr').innerHTML =
      'Please select short or long plot';
  }

  if (errorFound === false) {
    resetError();
    searchMovie(qparams);
  }
}

async function searchMovie(qparams) {
  const response = await fetch(
    `http://www.omdbapi.com/?apikey=4110b264&${qparams}`
  );
  const showElement = document.getElementById('result');
  showElement.textContent = '';
  if (response.ok === true) {
    const json = await response.json();
    const para = document.createElement('p');
    para.innerHTML = '';
    if (json.Response === 'False') {
      para.innerHTML = 'data not found!!!';
      showElement.appendChild(para);
    } else if (json.Response === 'True') {
      rating = '';
      try {
        rating = json.Ratings[0].Value + ' by ' + json.Ratings[0].Source;
      } catch (e) {}

      para.innerHTML = `<div class="row"><span>Title:</span> ${json.Title}</div>
          <div class="row"><img src="${json.Poster}"/></div>
          <div class="row"><span>Year:</span> ${json.Year}</div>
          <div class="row"><span>Rated:</span> ${json.Rated}</div>
          <div class="row"><span>Released:</span> ${json.Released}</div>
          <div class="row"><span>Runtime:</span> ${json.Runtime}</div>
          <div class="row"><span>Genre:</span> ${json.Genre}</div>
          <div class="row"><span>Director:</span> ${json.Director}</div>
          <div class="row"><span>Writer:</span> ${json.Writer}</div>
          <div class="row"><span>Actors:</span> ${json.Actors}</div>
          <div class="row"><span>Language:</span> ${json.Language}</div>
          <div class="row"><span>Country:</span> ${json.Country}</div>
          <div class="row"><span>Awards:</span> ${json.Awards}</div>
          <div class="row"><span>Ratings:</span> ${rating} </div> `;
      showElement.appendChild(para);
    }
  }
}
