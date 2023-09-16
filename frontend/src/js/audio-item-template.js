/*!
 * sri sri guru gaurangau jayatah
 */

import { escape } from 'instantsearch.js/es/lib/utils';
import { formatDurationForHumans } from './duration';
import { soundQualityRatingMapping } from './sound-quality-rating';

// Importing types using this guide: https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html#import-types
/**
 * @type { import("instantsearch.js").TemplateWithBindEvent<import("instantsearch.js").Hit & { __hitIndex: number; }>}
 */
export const itemTemplate = (hit, { html, components }) => html`
  <article
    class="flex w-full flex-col py-1 hover:!bg-yellow-100 hover:!bg-opacity-50 sm:flex-row sm:py-2"
    x-data="searchResultItem(${hit.objectID})"
    x-bind="root"
  >
    <!-- Main section -->
    <div class="flex grow items-start">
      <!-- Play button -->
      <button
        class="mt-2 w-8 flex-none rounded-full bg-neutral-600 fill-current focus:outline-none"
        title="Play"
        type="button"
        x-bind="playButton"
      >
        <!-- Material Icons: Play Arrow -->
        <svg
          x-show="!isPlaying"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          class="ml-1 h-8 w-6"
        >
          <path
            fill="white"
            d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.69L9.54 5.98C8.87 5.55 8 6.03 8 6.82z"
          />
        </svg>
        <!-- Material Icons: Pause -->
        <svg
          class="ml-1 h-8 w-6"
          x-show="isPlaying"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          x-cloak
        >
          <path
            fill="white"
            d="M8 19c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2v10c0 1.1.9 2 2 2zm6-12v10c0 1.1.9 2 2 2s2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2z"
          />
        </svg>
      </button>
      <div class="grow">
        <!-- First line -->
        <div class="ml-2 flex items-start justify-between space-x-1">
          <!-- Title -->
          <h3 class="grow break-words font-semibold" title="${hit.title}">
            <a href="/audios/${hit.objectID}/"
              >${components.Highlight({ hit, attribute: 'title' })}</a
            >
          </h3>
          <!-- Duration -->
          <span class="inline-flex flex-none items-center" title="Duration">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="mx-1 mt-0.5 w-4 stroke-current"
              stroke-width="0.2"
            >
              <path
                fill="currentColor"
                d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8s8 3.58 8 8s-3.58 8-8 8zm-.22-13h-.06c-.4 0-.72.32-.72.72v4.72c0 .35.18.68.49.86l4.15 2.49c.34.2.78.1.98-.24a.71.71 0 0 0-.25-.99l-3.87-2.3V7.72c0-.4-.32-.72-.72-.72z"
              />
            </svg>
            ${formatDurationForHumans(hit.duration)}</span
          >
        </div>
        <!-- Second line -->
        <div class="ml-2 flex items-end justify-between">
          <!-- Tags -->
          <div
            class="flex flex-wrap content-between align-baseline text-xs child-div:mr-1 child-div:mt-1 child-div:border-r child-div:border-gray-300 child-div:pr-1 last:child-div:border-0"
          >
            <!-- ID -->
            <div class="min-w-[6ch]" title="Unique file identifier">
              #${components.Highlight({ hit, attribute: 'archiveId' })}
            </div>
            <!-- Date -->
            ${hit.dateForHumans
              ? html`<div title="Date">
                  ${components.Highlight({ hit, attribute: 'dateForHumans' })}
                  ${hit.dateUncertain &&
                  html`<span title="Date is uncertain">(?)</span>`}
                  ${hit.timeOfDay &&
                  html`<span title="Time of day">${hit.timeOfDay}</span>`}
                </div>`
              : html`<div>Date unknown</div>`}

            <!-- Location -->
            ${hit.location
              ? html`<div title="Location">
                  ${components.Highlight({ hit, attribute: 'location' })}
                  ${hit.locationUncertain &&
                  html`<span title="Location is uncertain">(?)</span>`}
                </div>`
              : html`<div>Location unknown</div>`}

            <!-- Category -->
            ${hit.category &&
            html`<div title="Category">
              ${components.Highlight({ hit, attribute: 'category' })}
            </div>`}

            <!-- Languages -->
            ${hit.languages &&
            html`
              <div title="Language spoken in the recording">
                ${components.Highlight({ hit, attribute: 'languages' })}
              </div>
            `}
          </div>

          <!-- Actions -->
          <div class="flex divide-x text-sm child-a:ml-1 child-a:pl-1">
            <!-- Download -->
            <a
              href="${import.meta.env.STORAGE_BASE_URL}/${hit.objectID}.mp3"
              class="inline-flex space-x-1"
              title="Download file for listening offline"
            >
              <svg
                class="h-full w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              <span class="hidden lg:inline">Download</span>
            </a>
            <!-- Feedback -->
            <a
              href="${import.meta.env.FEEDBACK_FORM_AUDIOS}${hit.objectID}"
              target="_blank"
              class="inline-flex space-x-1"
              title="Help us improve! Give feedback about the sound quality, title, contents, language, etc of this file"
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
              <span class="hidden lg:inline">Feedback</span>
            </a>
            <!-- Share -->
            <a
              href="/audios/${hit.objectID}/"
              class="ml-1 inline-flex cursor-pointer pl-1"
              x-data="webshare('${escape(
                hit.title
              )}', '/audios/${hit.objectID}/')"
              x-bind="root"
              data-tippy-content="Link copied to clipboard"
              data-tippy-trigger="manual"
              data-tippy-placement="top"
              title="Share this audio"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="h-full w-3.5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                />
              </svg>
              <span class="hidden lg:ml-1 lg:inline">Share</span>
            </a>
          </div>
        </div>
      </div>
    </div>
    <!-- Complimentary section -->
    <div
      class="mt-2 flex flex-none items-end space-x-2 border-gray-200 pb-2 pl-7 pt-2 sm:ml-4 sm:mt-0 sm:w-36 sm:flex-col sm:items-start sm:space-x-0 sm:space-y-2 sm:border-l sm:pl-4 sm:pt-0"
    >
      <!-- Percentage -->
      ${hit.percentage != null // Use loose equality to cover undefined: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#loose_equality_using
        ? html`
            <div
              class="relative overflow-hidden rounded-lg border border-gray-300 text-xs"
              title="How much Srila Gurudeva is speaking in the recording"
            >
              <div
                class="absolute z-auto h-full w-[var(--percentage)] bg-gray-300 shadow-none"
                style="--percentage: ${Math.ceil(hit.percentage * 20) * 5}%"
              ></div>
              <div
                class="flex w-full justify-between space-x-2 px-1.5 opacity-95"
              >
                <span class="whitespace-nowrap">Srila Gurudeva</span>
                <span>${Math.ceil(hit.percentage * 20) * 5}%</span>
              </div>
            </div>
          `
        : null}

      <!-- Sound Quality Rating -->
      ${hit.soundQualityRating &&
      html`
        <div
          class="${soundQualityRatingMapping[hit.soundQualityRating]
            .color} flex flex-none space-x-1 rounded-lg border px-1.5 text-xs"
          title="Sound quality of the recording"
        >
          <svg
            class="h-4 w-4 flex-none stroke-current stroke-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path
              d="M83 384c-13-33-35-93.37-35-128C48 141.12 149.33 48 256 48s208 93.12 208 208c0 34.63-23 97-35 128"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="32"
            />
            <path
              d="M108.39 270.13l-13.69 8h0c-30.23 17.7-31.7 72.41-3.38 122.2s75.87 75.81 106.1 58.12h0l13.69-8a16.16 16.16 0 005.78-21.87L130 276a15.74 15.74 0 00-21.61-5.87zM403.61 270.13l13.69 8h0c30.23 17.69 31.74 72.4 3.38 122.19s-75.87 75.81-106.1 58.12h0l-13.69-8a16.16 16.16 0 01-5.78-21.87L382 276a15.74 15.74 0 0121.61-5.87z"
              fill="none"
              stroke="currentColor"
              stroke-miterlimit="10"
              stroke-width="32"
            />
          </svg>
          <span
            >${soundQualityRatingMapping[hit.soundQualityRating].label}</span
          >
        </div>
      `}
    </div>
  </article>
`;
