const ITEMS_PER_PAGE = [25, 50, 100];

const PAGINATION = {
  PAGES_RANGE_DISPLAYED: 10,
  ITEMS_PER_PAGE,
  DEFAULT: {
    currentPage: 1,
    itemsPerPage: ITEMS_PER_PAGE[0]
  }
};

export default PAGINATION;
