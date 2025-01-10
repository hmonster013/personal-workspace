import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkillUiComponent } from 'personal-common';

@Component({
  selector: 'app-list-skills',
  imports: [
    CommonModule
  ],
  templateUrl: './list-skills.component.html',
  styleUrl: './list-skills.component.css'
})
export class ListSkillsComponent {
  @Input() listSkills: any;
  leftItems = ['Item 1', 'Item 2', 'Item 3'];
  rightItems = ['Item A', 'Item B', 'Item C'];
  draggedItem: any = null;
  draggedFrom: string = '';

  // Handle mouse down event to start dragging
  onMouseDown(event: MouseEvent, column: string, item: any = null) {
    if (item) {
      this.draggedItem = item;
      this.draggedFrom = column;
      const itemElement = (event.target as HTMLElement);
      itemElement.classList.add('dragging');
    }

    // Allow dragging
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
    window.addEventListener('mouseup', this.onMouseUp.bind(this));
  }

  // Handle mouse move event to drag item
  onMouseMove(event: MouseEvent) {
    if (this.draggedItem) {
      const draggedElement = document.querySelector('.dragging') as HTMLElement; // Ép kiểu thành HTMLElement
      if (draggedElement) {
        draggedElement.style.left = `${event.pageX - draggedElement.offsetWidth / 2}px`;
        draggedElement.style.top = `${event.pageY - draggedElement.offsetHeight / 2}px`;
      }
    }
  }

  // Handle mouse up event to drop item
  onMouseUp(event: MouseEvent) {
    if (this.draggedItem) {
      const targetColumn = this.getTargetColumn(event);
      if (targetColumn) {
        this.moveItemToColumn(targetColumn);
      }

      // Cleanup
      this.resetDraggingState();
    }
  }

  // Determine which column the item is dropped in
  getTargetColumn(event: MouseEvent): string | null {
    const leftColumn = document.querySelector('.left-column');
    const rightColumn = document.querySelector('.right-column');

    const leftRect = leftColumn?.getBoundingClientRect();
    const rightRect = rightColumn?.getBoundingClientRect();

    if (leftRect && rightRect) {
      if (event.clientX < rightRect.left) {
        return 'left';
      } else if (event.clientX > leftRect.right) {
        return 'right';
      }
    }

    return null;
  }

  // Move the dragged item to the target column
  moveItemToColumn(targetColumn: string) {
    if (this.draggedFrom === targetColumn) return;

    const targetArray = targetColumn === 'left' ? this.leftItems : this.rightItems;
    const sourceArray = this.draggedFrom === 'left' ? this.leftItems : this.rightItems;

    const index = sourceArray.indexOf(this.draggedItem);
    if (index !== -1) {
      sourceArray.splice(index, 1);
      targetArray.push(this.draggedItem);
    }
  }

  // Reset dragging state after item is dropped
  resetDraggingState() {
    this.draggedItem = null;
    this.draggedFrom = '';
    const draggedElement = document.querySelector('.dragging') as HTMLElement; // Ép kiểu thành HTMLElement
    if (draggedElement) {
      draggedElement.classList.remove('dragging');
      draggedElement.style.left = '';  // Reset style
      draggedElement.style.top = '';   // Reset style
    }
    window.removeEventListener('mousemove', this.onMouseMove.bind(this));
    window.removeEventListener('mouseup', this.onMouseUp.bind(this));
  }
}
