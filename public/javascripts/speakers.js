class SpeakersManager {
  constructor() {
    this.speakers = [];
    this.loadSpeakers();
  }

  async loadSpeakers() {
    try {
      const response = await fetch("data/speakers.json");
      const data = await response.json();
      this.speakers = data.speakers;
      this.renderSpeakers();
    } catch (error) {
      console.error("Error on loading speakers", error);
      this.handleError();
    }
  }

  renderSpeakers() {
    const container = document.querySelector(".speakers__grid");
    if (!container) return;

    container.innerHTML = this.speakers
      .map((speaker) => this.createSpeakerCard(speaker))
      .join("");
  }

  createSpeakerCard(speaker) {
    return `
      <li class="speakers__grid__item">
        <button 
          class="speakers__grid__item__card"
          aria-label="View details of ${speaker.name}, ${speaker.role} at ${speaker.company}"
          onclick="speakersManager.handleOpenPopup(${speaker.id})"
        >
          <div class="speakers__grid__item__card__image">
            <img src="${speaker.image}" alt="" aria-hidden="true">
          </div>
          <div class="speakers__grid__item__card__info">
            <h3 class="speakers__grid__item__card__info__name">${speaker.name}</h3>
            <p class="speakers__grid__item__card__info__role">${speaker.role}</p>
            <p class="speakers__grid__item__card__info__company">${speaker.company}</p>
          </div>
        </button>
      </li>
    `;
  }

  renderSpeakerPopup(id) {
    const speaker = this.speakers.find((s) => s.id === id);

    return `
      <div class="speakers__grid__item__details speaker__${speaker.id}">
        <div class="speakers__grid__item__details__overlay"></div>
        <div class="speakers__grid__item__details__content">
          <div class="speakers__grid__item__details__content__header">
            <h3 class="speakers__grid__item__details__content__header__name">${speaker.name}</h3>
            <button class="speakers__grid__item__details__content__header__close" onclick="speakersManager.handleClosePopup(${speaker.id})">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.0312 12.9688C15.6406 13.5312 15.6406 14.5156 15.0312 15.0781C14.75 15.3594 14.375 15.5 14 15.5C13.5781 15.5 13.2031 15.3594 12.9219 15.0781L8 10.1562L3.03125 15.0781C2.75 15.3594 2.375 15.5 2 15.5C1.57812 15.5 1.20312 15.3594 0.921875 15.0781C0.3125 14.5156 0.3125 13.5312 0.921875 12.9688L5.84375 8L0.921875 3.07812C0.3125 2.51562 0.3125 1.53125 0.921875 0.96875C1.48438 0.359375 2.46875 0.359375 3.03125 0.96875L8 5.89062L12.9219 0.96875C13.4844 0.359375 14.4688 0.359375 15.0312 0.96875C15.6406 1.53125 15.6406 2.51562 15.0312 3.07812L10.1094 8.04688L15.0312 12.9688Z" fill="white"/>
              </svg>
            </button>            
          </div>
          <hr />
          <div class="speakers__grid__item__details__content__text">
            <div class="speakers__grid__item__details__content__text__inner">${speaker.details}</div>
          </div>
        </div>
      </div>
    `;
  }

  handleClosePopup(id) {
    const popup = document.querySelector(
      `.speakers__grid__item__details.speaker__${id}`
    );
    popup.classList.remove("active");
    document.body.classList.remove("overflow-blocked");
  }

  handleEscKeyPress(id) {
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        const activePopup = document.querySelector(
          ".speakers__grid__item__details.active"
        );
        if (activePopup) {
          this.handleClosePopup(id);
        }
      }
    });
  }

  handleOpenPopup(id) {
    this.handleEscKeyPress(id);
    const popupContainer = document.querySelector(".popup__container");
    popupContainer.innerHTML = this.renderSpeakerPopup(id);

    const popup = document.querySelector(
      `.speakers__grid__item__details.speaker__${id}`
    );

    if (!popup) return;

    popup.classList.add("active");
    document.body.classList.add("overflow-blocked");

    this.trapFocusCleanup = this.handleTrapFocus(popup);
  }

  handleError() {
    const container = document.querySelector(".speakers__grid");
    if (!container) return;

    container.innerHTML = `
      <div class="speakers__error">
        <p>Sorry, we couldn't load the speakers.</p>
        <button onclick="speakersManager.loadSpeakers()">Try again</button>
      </div>
    `;
  }

  handleTrapFocus(popup) {
    const focusableElements = popup.querySelectorAll(
      'a[href], area[href], input, select, textarea, button, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    firstElement.focus();
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (event) => {
      if (event.key === "Tab") {
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleTabKey);

    return () => {
      document.removeEventListener("keydown", handleTabKey);
    };
  }
}
