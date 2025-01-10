import { Injectable, ApplicationRef, ComponentRef, createComponent, EnvironmentInjector, Type } from '@angular/core';
import { ToastComponent } from '../toast/toast.component';
import { ToastStatus } from '../_utils/ToastStatus';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toasts: ComponentRef<ToastComponent>[] = [];

  constructor(
    private appRef: ApplicationRef,
    private injector: EnvironmentInjector
  ) {}

  show(message: string, type: string = ToastStatus.INFO, duration: number = 3000) {
    const toastRef = createComponent(ToastComponent, {
      environmentInjector: this.injector,
    });
  
    toastRef.instance.message = message;
    toastRef.instance.type = type;
  
    const offset = this.toasts.length * 60 + 16;
    toastRef.instance.offset = offset;
  
    // Thêm toast vào DOM
    document.body.appendChild(toastRef.location.nativeElement);
    this.appRef.attachView(toastRef.hostView);
  
    // Thêm vào danh sách
    this.toasts.push(toastRef);
  
    // Xóa toast sau duration
    setTimeout(() => {
      this.removeToast(toastRef);
    }, duration);
  }
  

  private removeToast(toastRef: ComponentRef<ToastComponent>) {
    // Xóa Toast khỏi DOM và danh sách
    const index = this.toasts.indexOf(toastRef);
    if (index >= 0) {
      this.toasts.splice(index, 1);
      this.appRef.detachView(toastRef.hostView);
      toastRef.destroy();
    }
  }
}
