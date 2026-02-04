import ReactPaginate from "react-paginate";
import styles from "./Pagination.module.css";

interface PaginationProps {
  pageCount: number;
  currentPage: number; // 🔑 додаємо
  onPageChange: (event: { selected: number }) => void;
}

export default function Pagination({
  pageCount,
  currentPage,
  onPageChange,
}: PaginationProps) {
  if (pageCount <= 1) return null;

  return (
    <ReactPaginate
      pageCount={pageCount}
      forcePage={currentPage - 1} // 🔑 КОНТРОЛЬ
      onPageChange={onPageChange}
      containerClassName={styles.pagination}
      activeClassName={styles.active}
      pageLinkClassName={styles.pageLink}
      previousLinkClassName={styles.pageLink}
      nextLinkClassName={styles.pageLink}
      breakLinkClassName={styles.pageLink}
    />
  );
}
