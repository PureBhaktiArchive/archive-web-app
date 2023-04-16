/*!
 * sri sri guru gaurangau jayatah
 */

import { formatDurationForHumans } from './duration';

// Importing types using this guide: https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html#import-types
/**
 * @type { import("instantsearch.js").TemplateWithBindEvent<import("instantsearch.js").Hit & { __hitIndex: number; }>}
 */
export const itemTemplate = (hit, { html, components }) => html`
  <article
    class="max-w-screen-mobile-s items-center pb-4 pl-0 pr-0 hover:!bg-yellow-200 hover:!bg-opacity-50 sm:pl-8 sm:pr-0 md:pl-8 md:pr-0"
  >
    <!-- Video player -->
    <iframe
      class="h-40 w-80 rounded-lg border-t-2 sm:w-72 md:w-72"
      src="https://www.youtube.com/embed/${hit.videoId}"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
    <h3 class="break-words font-semibold" title="Speaker name">
      <span>${components.Highlight({ hit, attribute: 'speakerName' })}, </span>
      ${hit.gurus.map(
        ({ fullName, abbreviation }, index) => html`<span
          key=${abbreviation}
          title="${fullName}"
          class="text-xs"
          >${abbreviation}${index < hit.gurus.length - 1 && `, `}</span
        >`
      )}
    </h3>
    <!-- Tag line -->
    <div
      class="flex w-80 flex-wrap content-between align-baseline text-xs child-div:mr-1 child-div:mt-1 child-div:border-r child-div:border-gray-300 child-div:pr-1 last:child-div:border-0 sm:w-72 md:w-72"
    >
      <div title="Language">${hit.language}</div>
      <div title="Speaker's Country">${hit.speakerCountry}</div>
      <div title="Date">${hit.dateForHumans}</div>
      <div title="Duration">${formatDurationForHumans(hit.duration)}</div>
      <!-- Feedback -->
      <div>
        <a
          href="${process.env.FEEDBACK_FORM_MEMORIES}${hit.objectID}"
          target="_blank"
          class="inline-flex space-x-1"
          title="Help us improve! Give feedback about the Speaker’s Name or Introduction, etc of this video"
        >
          <svg
            class="h-full w-4 stroke-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </a>
      </div>
    </div>
    <p class="text-xs font-bold">${hit.programName}</p>
    <!-- TODO: Extract Alpine component -->
    <p
      class="w-80 text-justify align-top text-xs sm:w-72 md:w-72"
      x-data="{ isCollapsed: false, maxLength: 170, originalContent: '', content: '' }"
      x-init="originalContent = $el.firstElementChild.textContent.trim(); content = originalContent.slice(0, maxLength)"
    >
      <span x-text="isCollapsed ? originalContent : content">
        ${hit.speakerIntro}
      </span>
      <button
        class="font-bold text-teal-800"
        x-on:click="isCollapsed = !isCollapsed"
        x-show="originalContent.length > maxLength"
        x-text="isCollapsed ? 'Read less' : '...Read more'"
      ></button>
    </p>
  </article>
`;
