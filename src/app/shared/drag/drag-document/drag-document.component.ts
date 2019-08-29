import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'tag-drag-document',
  templateUrl: './drag-document.component.html',
  styleUrls: ['./drag-document.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DragDocumentComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
