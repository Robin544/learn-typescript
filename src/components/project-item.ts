import Component from "./base-component";
import { Draggable } from "../models/drag-drop";
import { Project } from "../models/project";
import { autoBind } from "../decorators/autobind";

// ProjectItem class
export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
    private project: Project;

    get persons() {
        if (this.project.people === 1) return '1 person';
        return `${this.project.people} persons`;
    }

    constructor(hostId: string, project: Project) {
        super('single-project', hostId, true, project.id);
        this.project = project;

        this.configure();
        this.renderContent();
    }

    @autoBind
    dragStartHandler(event: DragEvent): void {
        event.dataTransfer!.setData('text/plain', this.project.id);
        event.dataTransfer!.effectAllowed = 'move';
    }

    dragEndHandler(_: DragEvent): void {
        console.info("Drag End!");
    }

    configure(): void {
        this.element.addEventListener("dragstart", this.dragStartHandler);
        this.element.addEventListener("dragend", this.dragEndHandler);
    }

    renderContent(): void {
        const { title, description, people } = this.project;
        this.element.querySelector('h2')!.textContent = title;
        this.element.querySelector('h3')!.textContent = this.persons + ' assigned';
        this.element.querySelector('p')!.textContent = description;
    }
}