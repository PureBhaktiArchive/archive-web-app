/*!
 * sri sri guru gaurangau jayatah
 */

const hide = (element) => {
  element.style.display = "none";
}

const show = (element, display = 'block') => {
  element.style.display = display;
}

export const dom = {
  loading: document.getElementById('loading'),
  searchError: document.getElementById('search-error'),
  filterPanel: document.getElementById('filter-panel'),
  stats: document.getElementById('stats'),
  hits: document.getElementById('hits'),
  pagination: document.getElementById('pagination'),
  underProgress: document.getElementById('under-progress'),
  hide, show
}

export const itemTemplateString = `
        <article id='hit-article' class="flex flex-col py-1 w-full sm:flex-row sm:py-2" data-file-id="{{objectID}}">
              <!-- Main section -->
              <div class="flex flex-grow items-start">
                <!-- Play button -->
                <button class="flex-none w-7 focus:outline-none fill-current" title="Play" type="button" onclick="togglePlay(this);">
                  <!-- Material Icons: Play Arrow -->
                  <svg class="play-icon {{#playing}}hidden{{/playing}}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.69L9.54 5.98C8.87 5.55 8 6.03 8 6.82z" />
                  </svg>
                  <!-- Material Icons: Pause -->
                  <svg class="pause-icon {{^playing}}hidden{{/playing}}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M8 19c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2v10c0 1.1.9 2 2 2zm6-12v10c0 1.1.9 2 2 2s2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2z" />
                  </svg>
                </button>
                <div class="flex-grow">
                  <!-- First line -->
                  <div class="flex items-start justify-between space-x-1">
                    <!-- Title -->
                    <h3 class="flex-grow break-words font-semibold" title="{{title}}">{{ title }}</h3>
                    <!-- Duration -->
                    <span class="flex-none" title="Duration">{{durationForHumans}}</span>
                  </div>
                  <!-- Second line -->
                  <div class="flex items-end justify-between">
                    <!-- Tags -->
                    <div class="children:last:border-0 flex flex-wrap content-between align-baseline children:mr-1 children:mt-1 children:pr-1 text-xs children:border-r children:border-gray-300">
                      <!-- ID -->
                      <div title="Unique file identifier">#{{idPadded}}</div>
                      {{#_highlightResult.dateForHumans}}
                      <div title="Date">
                        {{{value}}} {{#dateUncertain}}
                        <span title="Date is uncertain">(?)</span>
                        {{/dateUncertain}} {{#timeOfDay}}
                        <span title="Time of day">{{timeOfDay}}</span>
                        {{/timeOfDay}}
                      </div>
                      {{/_highlightResult.dateForHumans}} {{^_highlightResult.dateForHumans}}
                      <div>Date unknown</div>
                      {{/_highlightResult.dateForHumans}} {{#_highlightResult.location}}
                      <div title="Location">
                        {{{value}}} {{#locationUncertain}}
                        <span title="Location is uncertain">(?)</span>
                        {{/locationUncertain}}
                      </div>
                      {{/_highlightResult.location}} {{^_highlightResult.location}}
                      <div>Location unknown</div>
                      {{/_highlightResult.location}} {{#_highlightResult.category}}
                      <div title="Category">{{{value}}}</div>
                      {{/_highlightResult.category}} {{#_highlightResult.languages}}
                      <div title="Language spoken in the recording">{{{value}}}</div>
                      {{/_highlightResult.languages}}
                    </div>
                    <!-- Actions -->
                    <div class="flex children:ml-1 children:pl-1 text-sm divide-x">
                      <!-- Download -->
                      <a href="{{downloadURL}}" class="inline-flex space-x-1" title="Download file for listening offline">
                        <svg class="w-4 h-full" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span class="hidden lg:inline">Download</span>
                      </a>
                      <!-- Feedback -->
                      <a
                        href="{{feedbackURL}}"
                        target="_blank"
                        class="inline-flex space-x-1"
                        title="Help us improve! Give feedback about the sound quality, title, contents, language, etc of this file"
                      >
                        <svg class="w-4 h-full stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                          />
                        </svg>
                        <span class="hidden lg:inline">Feedback</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Complimentary section -->
              <div
                class="flex flex-none items-end mt-2 pb-2 pl-7 pt-2 border-gray-200 space-x-2 sm:flex-col sm:items-start sm:ml-4 sm:mt-0 sm:pl-4 sm:pt-0 sm:w-36 sm:border-l sm:space-x-0 sm:space-y-2"
              >
                {{#percentage}}
                <div class="relative text-xs border border-gray-300 rounded-lg overflow-hidden" title="How much Srila Gurudeva is speaking in the recording">
                  {{=^% %^=}}<!-- Changing delimiters to make interpolation in the \`styles\` attribute work -->
                  <div class="absolute z-auto h-full bg-gray-300 shadow-none" style="width: ^%percentageRounded%^%"></div>
                  ^%={{ }}=%^
                  <div class="flex justify-between px-1.5 w-full opacity-95 space-x-2">
                    <span class="whitespace-nowrap">Srila Gurudeva</span>
                    <span>{{percentageRounded}}%</span>
                  </div>
                </div>
                {{/percentage}} {{#soundQualityRating}}
                <div class="{{soundQualityRatingColor}} flex flex-none px-1.5 text-xs border rounded-lg space-x-1" title="Sound quality of the recording">
                  <svg class="flex-none w-4 h-4 stroke-current stroke-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
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
                  <span>{{soundQualityRatingLabel}}</span>
                </div>
                {{/soundQualityRating}}
              </div>
            </article>
      `

export const restoreSearchWidgets = () => {
  show(dom.loading)
  show(dom.filterPanel)
  hide(dom.stats)
  show(dom.hits)
  show(dom.underProgress)
  show(dom.pagination)
  hide(dom.searchError)
}
