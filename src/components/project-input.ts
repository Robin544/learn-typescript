import Component from "./base-component";
import { autoBind as Autobind } from "../decorators/autobind";
import { projectState } from "../state/project";
import * as Validation from "../utils/validation";

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

        const titleValidable: Validation.Validatable = {
            value: title,
            required: true
        }

        const descriptionValidable: Validation.Validatable = {
            value: description,
            required: true,
            minLength: 5
        }

        const peopleValidable: Validation.Validatable = {
            value: people,
            required: true,
            min: 1,
            max: 5
        }

        if (!Validation.validate(titleValidable) || !Validation.validate(descriptionValidable) || !Validation.validate(peopleValidable)) {
            alert('Invalid input, please try again!');
            return;
        } else {
            return [title, description, +people];
        }
    }

    @Autobind
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