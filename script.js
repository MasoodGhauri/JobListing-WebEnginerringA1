let jobLabels = [
  "Fullstack",
  "Backend",
  "Midweight",
  "HTML",
  "CSS",
  "JavaScript",
  "Sass",
  "Ruby",
  "React",
  "RoR",
  "Vue",
  "Django",
];

let jobList; // temperory variable for making flat array for job, level, tools languages
let originalData = [];

// starting point
$(document).ready(() => {
  getData();
});

const getData = () => {
  $.getJSON("data.json", (data) => {
    originalData = data;
    display(applyFilters());
  });
};

const display = (arr) => {
  $("#itemList").empty();

  for (let i = 0; i < arr.length; i++) {
    append(arr[i]);
  }
};

const removeFilter = (btn) => {
  let toRemove = $(btn).siblings().text();
  jobLabels = jobLabels.filter((item) => item !== toRemove); // removing clicked tag from tags array

  $(btn).parent().remove(); // removing from filterbar

  display(applyFilters());
};

const clearAll = () => {
  $(".filter").remove();
  jobLabels.splice(0, jobLabels.length); // tags array empty

  display(originalData);

  $("#filters").remove(); // removing filters sibling div to make the clear div left
  $("#clear").text("No filters applied, showing all jobs.");
};

const applyFilters = () => {
  let temp = [];

  for (let i = 0; i < originalData.length; i++) {
    let tjobList = [
      originalData[i].role,
      originalData[i].level,
      originalData[i].languages,
      originalData[i].tools,
    ].flat(); // adding all array to one array

    if (jobLabels.length === 0) {
      return originalData;
    }
    let containFlag = tjobList.some((item) => jobLabels.includes(item));

    if (containFlag) temp.push(originalData[i]);
  }

  return temp; // returning the filtered data
};

// adds item to item list div
const append = (data) => {
  $("#itemList").append(`
    <div id=${data.id} class="item" onClick="showDetails()"}>
      <div id="itemWrapper">
        <img src=${data.logo} />

        <div id="description">
          <div id="tagWrapper">
            <h6>${data.company}</h6>
            <div id="tags">
            ${data.new === true ? '<span id="new">New</span>' : ""}
            ${
              data.featured === true
                ? '<span id="featured">Featured</span>'
                : ""
            }
            </div>
          </div>
          <h4>${data.position}</h4>
          <p>${
            data.postedAt + " - " + data.contract + " - " + data.location
          }</p>
        </div>

        ${
          ((jobList = [
            data.role,
            data.level,
            data.languages,
            data.tools,
          ].flat()),
          `<div id="labels">
            ${jobList.map((item) => `<span>${item}</span>`).join("")}
          </div>`)
        }

      </div>
    </div>
`);
};

const showDetails = () => {
  let clickedID = event.currentTarget.id;
  clickedID = parseInt(clickedID); // converting string to number
  let index = originalData.findIndex((obj) => obj.id === clickedID); // finding index of clicked item in data array

  let obj = originalData[index];

  const $it = $(".detailsBody");

  $it.attr("id", clickedID);
  $it.find("img").attr("src", obj.logo);
  $it.find("h2").text(obj.position);
  $it.find("h4").text(obj.level + " Expertise");
  $it.find(".companyDesc h3").text(obj.company);
  $it.find(".location").text(obj.contract + " - " + obj.location);
  $it.find(".time").text("Posted " + obj.postedAt);

  let temp = [obj.role, obj.level, obj.languages, obj.tools].flat();

  $it.find(".descLabels .lab").empty();
  $it
    .find(".descLabels .lab")
    .append(`${temp.map((item) => `<span>${item}</span>`).join("")}`);

  $(".detailsWrapper").fadeIn().css("display", "flex");
};

$(() => {
  $(".submitBtn").click(function (event) {
    event.preventDefault();

    // checking filled inputs
    if (
      $("#positionName").val() !== "" &&
      $("#companyName").val() !== "" &&
      $("#companyLogoURL").val() !== "" &&
      $("#role").val() !== "" &&
      $("#level").val() !== "" &&
      $("#languages").val() !== "" &&
      $("#tools").val() !== ""
    ) {
      let highestId = originalData.reduce(
        (maxId, obj) => Math.max(maxId, obj.id),
        -Infinity
      );
      let featured = false;
      if ($("#featured").prop("checked")) {
        featured = true;
        console.log(featured);
      }

      let formData = {
        id: highestId + 1,
        position: $("#positionName").val(),
        company: $("#companyName").val(),
        logo: $("#companyLogoURL").val(),
        new: true,
        featured: featured,
        role: $("#positionName").val(),
        level: $("#level").val(),
        postedAt: "Just Now",
        contract: $("#contract").val(),
        location: "Worldwide",
        languages: $("#languages")
          .val()
          .split(",")
          .map((item) => item.trim()),
        tools: $("#tools")
          .val()
          .split(",")
          .map((item) => item.trim()),
      };

      originalData.push(formData);

      $(".popupWrapper").fadeOut().css("display", "flex");

      $("#filter").remove();

      display(applyFilters());
    } else {
      $("form").append("<label id='alert'>all fields required</label>");
      setTimeout(() => {
        $("form #alert").remove();
      }, 4000);
    }
  });
});

$(() => {
  $("#popupBtn").click(() => {
    $(".popupWrapper").fadeIn().css("display", "flex");
  });
});

$(() => {
  $(".closePopup").click(() => {
    $(".popupWrapper").fadeOut().css("display", "flex flex");
  });
});

$(() => {
  $(".close").click(() => {
    $(".detailsWrapper").fadeOut().css("display", "flex");
  });
});

$(() => {
  $(".del").click(() => {
    let index = parseInt($(".detailsBody").attr("id"));
    index = originalData.findIndex((obj) => obj.id === index); // finding index of desired item in data array

    originalData.splice(index, 1); // removing data object from data array

    $(".detailsWrapper").fadeOut().css("display", "flex");

    display(applyFilters(originalData));
  });
});
