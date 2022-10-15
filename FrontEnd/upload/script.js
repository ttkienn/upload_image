function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      $uploadedImg[0].style.backgroundImage = 'url(' + e.target.result + ')';
    };

    reader.readAsDataURL(input.files[0]);
    console.log(input.files[0]);
  }
}
function myFunction() {
  var copyText = document.getElementById("link");
  copyText.select();
  copyText.setSelectionRange(0, 99999)
  document.execCommand("copy");
  alert("Đã copy link : " + copyText.value);
}

var $form = $("#imageUploadForm"),
  $file = $("#file"),
  $uploadedImg = $("#uploadedImg"),
  $helpText = $("#helpText"),
  $link = document.querySelector(".success");
$file.on('change', function () {
  readURL(this);
  $form.addClass('loading');
});
$uploadedImg.on('webkitAnimationEnd MSAnimationEnd oAnimationEnd animationend', function () {
  $form.addClass('loaded');
  var character = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var random = '';
  var number = 32;
  for (var i = 0; i < number; i++) {
    random += character.charAt(Math.floor(Math.random() * character.length));
  }
  let base64 = $uploadedImg[0].style.backgroundImage;
  base64 = base64.replace('url("', '').replace('")', '');
  axios({
    method: 'post',
    url: '/uploadFile',
    data: {
      type: $file[0].files[0].type,
      data: base64,
      code: random
    }
  }).then(function (response) {
    console.log(response);
    if (response.data.status == 200) {
      $helpText.text('Uploaded!');
      $link.innerHTML = `<center><input type="text" value="${document.location}${response.data.link}" id="link" class="form-control" readonly><button onclick="myFunction()">Copy text</button><center>`;
    }
    else {
      $helpText.text('Lỗi hệ thống !');
    }
  })
});
$helpText.on('webkitAnimationEnd MSAnimationEnd oAnimationEnd animationend', function () {
    $file.val(''); $form.removeClass('loading').removeClass('loaded');
});