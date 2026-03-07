"""add_category_and_tags
Revision ID: 44b6743dda13
Revises: 77e24d76e1d2
Create Date: 2026-03-07 12:00:00.000000
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '44b6743dda13'
down_revision = '77e24d76e1d2'
branch_labels = None
depends_on = None

def upgrade():
    op.add_column('skills', sa.Column('category', sa.String(), nullable=False, server_default='frontend'))
    op.add_column('skills', sa.Column('tags', sa.ARRAY(sa.String()), nullable=True))
    op.create_index(op.f('ix_skills_category'), 'skills', ['category'], unique=False)

def downgrade():
    op.drop_index(op.f('ix_skills_category'), table_name='skills')
    op.drop_column('skills', 'tags')
    op.drop_column('skills', 'category')
