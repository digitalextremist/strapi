'use strict';

const _ = require('lodash');
const { contentTypes: contentTypesUtils } = require('@strapi/utils');
const { NotFoundError, ForbiddenError } = require('@strapi/utils').errors;
const { getService } = require('../../utils');

const { CREATED_BY_ATTRIBUTE } = contentTypesUtils.constants;

const findEntityAndCheckPermissions = async (ability, action, model, id) => {
  const file = await getService('upload').findOne(id, [CREATED_BY_ATTRIBUTE]);

  if (_.isNil(file)) {
    throw new NotFoundError();
  }

  const pm = strapi.admin.services.permission.createPermissionsManager({ ability, action, model });

  const creatorId = _.get(file, [CREATED_BY_ATTRIBUTE, 'id']);
  const author = creatorId ? await strapi.admin.services.user.findOne(creatorId, ['roles']) : null;

  const fileWithRoles = _.set(_.cloneDeep(file), 'createdBy', author);

  if (pm.ability.cannot(pm.action, pm.toSubject(fileWithRoles))) {
    throw new ForbiddenError();
  }

  return { pm, file };
};

module.exports = {
  findEntityAndCheckPermissions,
};