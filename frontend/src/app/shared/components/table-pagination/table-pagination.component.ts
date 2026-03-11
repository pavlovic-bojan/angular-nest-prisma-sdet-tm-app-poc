import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'app-table-pagination',
  standalone: true,
  template: `
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
      <div class="flex items-center gap-4">
        <span class="text-sm text-slate-600 dark:text-slate-400">Rows per page:</span>
        <select
          [value]="pageSize()"
          (change)="onPageSizeChange($event)"
          data-testid="pagination-size"
          class="px-3 py-1.5 border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-slate-500"
        >
          @for (size of pageSizeOptions(); track size) {
            <option [value]="size">{{ size }}</option>
          }
        </select>
        <span class="text-sm text-slate-600 dark:text-slate-400">
          {{ startItem() }}-{{ endItem() }} of {{ totalItems() }}
        </span>
      </div>
      <div class="flex items-center gap-2">
        <button
          (click)="goToPage(currentPage() - 1)"
          [disabled]="currentPage() <= 1"
          data-testid="pagination-prev"
          class="px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 dark:text-slate-200"
        >
          Previous
        </button>
        @for (p of visiblePages(); track p) {
          <button
            (click)="goToPage(p)"
            class="min-w-[2rem] px-3 py-1.5 text-sm rounded-lg transition"
            [class.bg-slate-800]="p === currentPage()"
            [class.text-white]="p === currentPage()"
            [class.border]="p !== currentPage()"
            [class.border-slate-300]="p !== currentPage()"
            [class.dark:border-slate-600]="p !== currentPage()"
            [class.hover:bg-slate-100]="p !== currentPage()"
            [class.dark:hover:bg-slate-800]="p !== currentPage()"
          >
            {{ p }}
          </button>
        }
        <button
          (click)="goToPage(currentPage() + 1)"
          [disabled]="currentPage() >= totalPages()"
          data-testid="pagination-next"
          class="px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 dark:text-slate-200"
        >
          Next
        </button>
      </div>
    </div>
  `,
})
export class TablePaginationComponent {
  totalItems = input.required<number>();
  currentPage = input.required<number>();
  pageSize = input.required<number>();
  pageSizeOptions = input<number[]>([5, 10, 25, 50, 100]);

  pageChange = output<number>();
  pageSizeChange = output<number>();

  totalPages = computed(() => Math.max(1, Math.ceil(this.totalItems() / this.pageSize())));
  startItem = computed(() =>
    this.totalItems() === 0 ? 0 : (this.currentPage() - 1) * this.pageSize() + 1
  );
  endItem = computed(() =>
    this.totalItems() === 0 ? 0 : Math.min(this.currentPage() * this.pageSize(), this.totalItems())
  );

  visiblePages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const delta = 2;
    const pages: number[] = [];
    const rangeStart = Math.max(1, current - delta);
    const rangeEnd = Math.min(total, current + delta);
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }
    return pages;
  });

  onPageSizeChange(event: Event): void {
    const value = +(event.target as HTMLSelectElement).value;
    this.pageSizeChange.emit(value);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.pageChange.emit(page);
    }
  }
}
