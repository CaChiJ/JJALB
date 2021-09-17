const intervalTypeLong = 45;
const intervalTypeShort = 20;

function typing() {
  TypeHangul.type("#upper-description", {
    intervalType: intervalTypeLong,
    humanize: 0.3,
  });

  setTimeout(() => {
    document.getElementById("lower-description").innerText =
      "클릭 한 번으로 긴 글을 짧게 줄여보세요!";
    TypeHangul.type("#lower-description", {
      intervalType: intervalTypeShort,
      humanize: 0.3,
    });
  }, 2500);
}

typing();
