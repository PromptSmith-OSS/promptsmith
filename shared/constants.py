EXCLUDE_FOR_CREATE = ('id', 'created_at', 'updated_at')
EXCLUDE_FOR_UPDATE = ('id', 'created_at', 'updated_at', 'uuid')  # ignore uuid in update
EXCLUDE_FOR_RESPONSE = ('id',)  # # do not expose id
