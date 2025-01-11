import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-blog',
  imports: [
    QuillModule, 
    CommonModule,
    FormsModule
  ],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent {
  model: string = '';

  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote'],

      // [{'header': 1}, {'header': 2}],               // custom button values
      [{'list': 'ordered'}, {'list': 'bullet'}],
      [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
      [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
      [{'direction': 'rtl'}],                         // text direction

      // [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
      // [{'header': [1, 2, 3, 4, 5, 6, false]}],

      // [{'color': []}, {'background': []}],
      // [{'font': []}],
      [{'align': []}],

      ['clean'],                                       // remove formatting button

      // ['link', 'image', 'video',]                   // link and image, video
      ['link']                                         // link

    ]
  };
}
