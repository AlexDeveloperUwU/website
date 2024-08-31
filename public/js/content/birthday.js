document.addEventListener("DOMContentLoaded", () => {
  const birthdayDate = new Date(new Date().getFullYear(), 8, 11);

  function toggleVisibility() {
    const birthdayDiv = document.getElementById("birthday");
    const iconsDiv = document.getElementById("icons");
    const today = new Date();

    if (today.toDateString() === birthdayDate.toDateString()) {
      if (iconsDiv.classList.contains("hidden")) {
        iconsDiv.classList.remove("hidden");
        iconsDiv.classList.add("fade-in");
        birthdayDiv.classList.add("hidden");
        birthdayDiv.classList.remove("fade-in");
      } else {
        iconsDiv.classList.add("fade-out");
        setTimeout(() => {
          iconsDiv.classList.add("hidden");
          iconsDiv.classList.remove("fade-out");
          birthdayDiv.classList.remove("hidden");
          birthdayDiv.classList.add("fade-in");
          launchConfetti();
        }, 605);
      }
    } else {
      if (iconsDiv.classList.contains("hidden")) {
        iconsDiv.classList.remove("hidden");
        iconsDiv.classList.add("fade-in");
        birthdayDiv.classList.add("hidden");
        birthdayDiv.classList.remove("fade-in");
      } else {
        iconsDiv.classList.add("fade-out");
        setTimeout(() => {
          iconsDiv.classList.add("hidden");
          iconsDiv.classList.remove("fade-out");
          birthdayDiv.classList.remove("hidden");
          birthdayDiv.classList.add("fade-in");
        }, 605);
      }
    }
  }

  function updateBirthdayMessage() {
    const today = new Date();
    const birthdayMessage = document.getElementById("birthday-message");

    if (today.toDateString() === birthdayDate.toDateString()) {
      birthdayMessage.textContent = "¡Feliz cumple! 🎂";
    } else {
      const timeDiff = birthdayDate - today;
      const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      birthdayMessage.textContent = `¡Faltan ${daysRemaining} días! 🎂`;
    }
  }

  function launchConfetti() {
    const end = Date.now() + 8.5 * 1000;
    const colors = ["#ff69b4", "#ffd700", "#87ceeb", "#32cd32", "#ff4500"];

    (function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });

      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }

  function startBirthdayAnimation() {
    const today = new Date();
    updateBirthdayMessage();

    if (isWithinTwoWeeksOfBirthday() || today.toDateString() === birthdayDate.toDateString()) {
      setInterval(toggleVisibility, 10000);

      if (today.toDateString() === birthdayDate.toDateString()) {
        document.getElementById("birthday").classList.remove("hidden");
        document.getElementById("icons").classList.add("hidden");
        setTimeout(launchConfetti, 1000);
      }
    }
  }

  function isWithinTwoWeeksOfBirthday() {
    const today = new Date();
    const twoWeeksBeforeBirthday = new Date(birthdayDate);
    twoWeeksBeforeBirthday.setDate(birthdayDate.getDate() - 14);

    return today >= twoWeeksBeforeBirthday && today <= birthdayDate;
  }

  startBirthdayAnimation();
});
