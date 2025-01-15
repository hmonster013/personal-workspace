import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../_services/blog.service';
import { ToastService } from '../_services/toast.service';
import { ToastStatus } from '../_utils/ToastStatus';
import { JCode } from '../_utils/JCode';
import { CommonModule } from '@angular/common';
import { SkillUiComponent } from "../skill-ui/skill-ui.component";
import { URI } from '../_utils/URI';

@Component({
  selector: 'lib-blog-ui',
  imports: [
    CommonModule,
    SkillUiComponent
],
  templateUrl: './blog-ui.component.html',
  styleUrl: './blog-ui.component.css'
})
export class BlogUiComponent implements OnInit {
  blogId: any;
  currentBlog: any;
  response: any;
  toc: { id: string; title: string }[] = [];

  constructor(
    private route: ActivatedRoute,
    private blogsService: BlogService,
    private toastService: ToastService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.blogId = this.route.snapshot.paramMap.get('id');
    this.getBlogData(this.blogId);
  }

  ngAfterViewInit() {
    this.addIdsToHeadings();
  }

  getBlogData(blogId: any) {
    this.blogsService.viewDataById(blogId).subscribe(res => {
      this.response = res;
      if (this.response.status == JCode.SUCCESS) {
        this.currentBlog = this.response.data;
        this.generateTOC();
    } else {
        this.toastService.show("Load data error",  ToastStatus.ERROR);
      }
    });
  }

  generateTOC() {
    const parser = new DOMParser();
    const doc = parser.parseFromString(this.currentBlog.content, 'text/html');
    const headings = doc.querySelectorAll('h1, h2, h3');
    this.toc = Array.from(headings).map((heading, index) => {
      const id = `heading-${index}`;
      heading.id = id;
      return { id, title: heading.textContent || '' };
    });
  }

  addIdsToHeadings() {
    const contentContainer = document.querySelector('.blog-container__body div[innerHTML]');
    if (contentContainer) {
      const headings = contentContainer.querySelectorAll('h1, h2, h3');
      headings.forEach((heading, index) => {
        heading.id = `heading-${index}`;
      });
    }
  }

  highlightActiveTOC() {
    const headings = document.querySelectorAll('h1, h2, h3');
    let activeId = '';
    headings.forEach((heading) => {
      const rect = heading.getBoundingClientRect();
      if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
        activeId = heading.id;
      }
    });

    this.toc.forEach((item) => {
      const tocItem = document.querySelector(`a[href="#${item.id}"]`);
      if (tocItem) {
        tocItem.classList.toggle('active', item.id === activeId);
      }
    });
  }

  goToBlog() {
    this.router.navigate([URI.BLOGS]);
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const toc = document.querySelector('.toc-container') as HTMLElement;
    const blog = document.querySelector('.blog-container') as HTMLElement;
    const topOffset = 100; // Offset từ đỉnh màn hình
    const scrollY = window.scrollY; // Vị trí cuộn hiện tại
  
    // Kiểm tra nếu chiều rộng < 1250px, vô hiệu hóa cuộn
    if (window.innerWidth < 1250) {
      toc.style.marginTop = '0px'; // Reset margin-top
      return; // Dừng xử lý cuộn
    }
  
    // Lấy vị trí ban đầu của blog-container
    const blogRect = blog.getBoundingClientRect();
    const blogTop = blogRect.top + scrollY;
  
    // Kiểm tra vị trí cuộn để điều chỉnh margin-top của toc
    if (scrollY > blogTop - topOffset) {
      toc.style.marginTop = `${scrollY - blogTop + topOffset}px`;
    } else {
      toc.style.marginTop = '0px'; // Reset margin-top khi chưa cuộn đủ
    }
  }  
}
