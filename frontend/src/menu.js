/*!
 * sri sri guru gaurangau jayatah
 */

document
  .querySelectorAll('[data-menu-toggle]')
  .forEach(
    (toggle) =>
      (toggle.onclick = () =>
        document
          .querySelectorAll('[data-menu-toggled]')
          .forEach((target) => target.classList.toggle('hidden')))
  );
