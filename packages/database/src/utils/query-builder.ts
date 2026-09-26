import { Model, Query, FilterQuery, Document } from 'mongoose';
import type { Keys, PaginatedResponse, PopulateInput } from './pagination-types';

class QueryBuilder<Doc extends Document = Document, Lean = Doc> {
  private query: Query<Doc[], Doc>;
  private page = 1;
  private limit = 10;

  constructor(private model: Model<Doc>) {
    this.query = model.find();
  }

  search(term?: unknown, fields: Keys<Doc>[] = []) {
    if (!term || !fields.length) return this;
    const text = Array.isArray(term) ? term.map(String).join(' ') : String(term);
    const regex = new RegExp(text, 'i');
    this.query = this.query.find({ $or: fields.map((f) => ({ [f]: regex })) } as FilterQuery<Doc>);
    return this;
  }

  filter(filters: Partial<Record<Keys<Doc>, unknown>>) {
    Object.entries(filters).forEach(([k, v]) => {
      if (v === undefined || v === null) return;
      this.query = this.query.find({
        [k]: Array.isArray(v) ? { $in: v.map(String) } : String(v),
      } as FilterQuery<Doc>);
    });
    return this;
  }

  sort(sortBy?: unknown) {
    if (!sortBy) return this;
    const s = typeof sortBy === 'string' ? sortBy.split(',').join(' ') : String(sortBy);
    this.query = this.query.sort(s);
    return this;
  }

  select(fields?: string | string[]) {
    if (!fields) return this;
    const f = Array.isArray(fields) ? fields.join(' ') : fields.split(',').join(' ');
    this.query = this.query.select(f);
    return this;
  }

  populate(p?: PopulateInput) {
    if (!p) return this;
    if (Array.isArray(p)) {
      for (const x of p) {
        this.query = typeof x === 'string' ? this.query.populate({ path: x }) : this.query.populate(x);
      }
      return this;
    }
    this.query = typeof p === 'string' ? this.query.populate({ path: p }) : this.query.populate(p);
    return this;
  }

  paginate(page?: unknown, limit?: unknown) {
    let p = 1;
    let l = 10;
    if (page != null) {
      p = typeof page === 'string' ? parseInt(page, 10) : Number(page);
      if (Number.isNaN(p) || p < 1) p = 1;
    }
    if (limit != null) {
      l = typeof limit === 'string' ? parseInt(limit, 10) : Number(limit);
      if (Number.isNaN(l) || l < 1) l = 10;
    }
    this.page = p;
    this.limit = l;
    this.query = this.query.skip((p - 1) * l).limit(l);
    return this;
  }

  async exec(): Promise<PaginatedResponse<Lean>> {
    const filter = this.query.getFilter() as FilterQuery<Doc>;
    const total = await this.model.countDocuments(filter);
    const totalPages = Math.ceil(total / this.limit);
    const data = (await this.query.lean().exec()) as Lean[];
    return {
      meta: {
        total,
        page: this.page,
        limit: this.limit,
        totalPages,
        hasNextPage: this.page < totalPages,
        hasPrevPage: this.page > 1,
        nextPage: this.page < totalPages ? this.page + 1 : null,
        prevPage: this.page > 1 ? this.page - 1 : null,
      },
      data,
    };
  }
}

export function qb(model: Model<any>) {
  return new QueryBuilder<any, Record<string, unknown>>(model);
}
