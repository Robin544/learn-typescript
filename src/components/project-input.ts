import { Component } from "./base-component.js";
import { autoBind } from "../decorators/autobind.js";
import { projectState } from "../state/project.js";
import { Validatable, validate } from "../utils/validation.js";

// ProjectInput class definition
export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
    titleInputElement: HTMLInputElement;
    decriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor() {
        super('project-input', 'app', true, 'user-input');
        this.titleInputElement = this.element.querySelector('#title')! as HTMLInputElement;
        this.decriptionInputElement = this.element.querySelector('#description')! as HTMLInputElement;
        this.peopleInputElement = this.element.querySelector('#people')! as HTMLInputElement;

        this.configure();
        this.renderContent();
    }

    configure() {
        this.element.addEventListener('submit', this.handleSubmit);
    }

    renderContent(): void { }

    private clearInputs() {
        this.titleInputElement.value = '';
        this.decriptionInputElement.value = '';
        this.peopleInputElement.value = '';
    }

    private gatherUserInputs(): [string, string, number] | void {
        const title = this.titleInputElement.value;
        const description = this.decriptionInputElement.value;
        const people = this.peopleInputElement.value;

        const titleValidable: Validatable = {
            value: title,
            required: true
        }

        const descriptionValidable: Validatable = {
            value: description,
            required: true,
            minLength: 5
        }

        const peopleValidable: Validatable = {
            value: people,
            required: true,
            min: 1,
            max: 5
        }

        if (!validate(titleValidable) || !validate(descriptionValidable) || !validate(peopleValidable)) {
            alert('Invalid input, please try again!');
            return;
        } else {
            return [title, description, +people];
        }
    }

    @autoBind
    private handleSubmit(event: Event) {
        event.preventDefault();
        const userInput = this.gatherUserInputs();
        if (Array.isArray(userInput)) {
            const [title, description, people] = userInput;
            projectState.addProject(title, description, people);
            this.clearInputs();
        }
    }
}