/** Class representing the content */
export default class MultiMediaChoiceContent {
  /**
   * @constructor
   * @param {object} params Parameters.
   * @param {number} contentId Content's id.
   * @param {object} [callbacks = {}] Callbacks.
   */
  constructor(params = {}, contentId, callbacks = {}) {
    this.params = params;
    this.contentId = contentId;

    this.selected = [];
    this.selectables = [];

    this.content = document.createElement('div');
    this.content.classList.add('h5p-multi-media-choice-content');

    // Build n options
    this.options = this.params.options.map((option, index) =>
      this.buildOption(option, index)
    );
    this.content = this.buildOptionList(this.options);
  }

  /**
   * Return the DOM for this class.
   * @return {HTMLElement} DOM for this class.
   */
  getDOM() {
    return this.content;
  }

  /**
   * Build options.
   * @param {MultiMediaChoiceOption[]} options List of option objects.
   * @return {HTMLElement} List view of options.
   */
  buildOptionList(options) {
    const optionList = document.createElement('div');
    optionList.classList.add('h5p-multi-media-choice-options');
    options.forEach((option) => {
      optionList.appendChild(option); // option.getDOM();
    });
    return optionList;
  }

  /**
   * Build option.
   * @param {object} option Option object from the editor.
   * @param {number} key Option object from the editor.
   * @return {MultiMediaChoiceOption} Option. //TODO: not correct
   */
  buildOption(option, key) {
    const optionContainer = document.createElement('div');

    const selectable = document.createElement('input');
    if(this.singleAnswer()) {
      selectable.setAttribute('type', 'radio');
      selectable.setAttribute('name', 'options');
    }
    else
      selectable.setAttribute("type", "checkbox");

    selectable.addEventListener('click', function () {
      this.toggleSelected(this.selectables.length); //TODO: check if this works
    });
    this.selectables.push(selectable);
    optionContainer.appendChild(selectable);

    const {
      alt,
      title,
      file: { path },
    } = option.media.params;

    const image = document.createElement('img');
    image.setAttribute('src', H5P.getPath(path, this.contentId));
    image.setAttribute('alt', alt);
    image.setAttribute('title', title);
    image.setAttribute('tabindex', key);
    image.src = H5P.getPath(path, this.contentId);

    optionContainer.appendChild(image);

    return optionContainer;
    //return image;
  }

  /**
   * Counts options marked as correct
   * @returns {number} Number of options marked as correct in the editor.
   */
  getNumberOfCorrectOptions() {
    return this.params.options.filter((option) => option.correct).length;
  }

  /**
   * Determines the task type, indicating whether the answers should be
   * radio buttons or checkboxes.
   * @returns true if the options should be displayed as radiobuttons,
   * @returns false if they should be displayed as checkboxes
   */
   singleAnswer() {
    if(this.params.behaviour.type === 'auto')
      return this.getNumberOfCorrectOptions() === 1;
    return this.params.behaviour.type === 'single';
  }

  /**
   * Toggles the given option. If the options are radio buttons
   * the previously checked one is unchecked
   * @param {Number} optionIndex Which option is being selected
   */
  toggleSelected(optionIndex) {
    const option = this.selectables[optionIndex];
    if (option.checked) {
      const selIndex = this.selected.indexOf(optionIndex);
      if (selIndex > -1)
        this.selected.splice(selIndex, 1);
      option.checked = false;
    }
    else {
      if (this.singleAnswer() && this.selected.length < 0) {
        this.selectables[this.selected[0]].checked = false;
        this.selected = {optionIndex};
      }
      else {
        this.selected.push(optionIndex);
      }
      option.checked = true;
    }
  }

  /**
   * Resets all selected options
   */
  resetSelections() {
    this.selected = {};
    this.selectables.forEach(function (selectable, index) {
      selectable.checked = false;
    });
  }
}
