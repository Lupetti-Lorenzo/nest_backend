import { sql } from 'drizzle-orm';
import { SqlConditions } from 'nest-casl/dist/proxies/conditions.proxy';
import * as format from 'pg-format';

export function fromConditionsToWhere(casl_sql_permissions?: SqlConditions) {
	let conditions: string = ``;
	if (casl_sql_permissions) {
		conditions += createSqlPermissionWhere(casl_sql_permissions);
	}
	console.log(conditions);
	return conditions;
}

export function createSqlPermissionWhere(
	casl_sql_permissions: SqlConditions,
): string {
	const [query, values] = casl_sql_permissions;
	console.log('values:' + values);
	const finalQuery = query.replace(/\$(\d+)/g, (match, p1) => {
		const index = parseInt(p1, 10) - 1;
		return index < values.length ? String(values[index]) : match;
	});
	console.log('final:' + finalQuery);
	return finalQuery;
}

/**
 * Function to convert MongoDB-style query to SQL WHERE clause using pg-format
 * @param {object} query - The MongoDB-style query
 * @returns {string} - The formatted SQL WHERE clause string
 */
// export function mongoToSqlWhereClause(query) {
// 	// Recursive function to process each condition
// 	function processCondition(condition) {
// 		if (typeof condition !== 'object' || condition === null) {
// 			throw new Error('Invalid condition type'); // Basic validation of the condition
// 		}

// 		const keys = Object.keys(condition);
// 		if (keys.length === 0) {
// 			return ''; // Return empty string for empty conditions
// 		}

// 		return keys
// 			.map((key) => {
// 				const value = condition[key];
// 				switch (key) {
// 					case '$or':
// 					case '$and':
// 						// Process $or and $and recursively with appropriate joining operator
// 						const operator = key === '$or' ? ' OR ' : ' AND ';
// 						return (
// 							'(' +
// 							value
// 								.map((subcondition) => {
// 									const subkeys = Object.keys(subcondition);
// 									// Check if subcondition needs further processing or is a simple key-value
// 									if (
// 										subkeys.some((k) => ['$and', '$or', '$nor'].includes(k))
// 									) {
// 										return processCondition(subcondition); // Recursive processing
// 									} else {
// 										return '(' + processCondition(subcondition) + ')'; // Wrap simple conditions for correct precedence
// 									}
// 								})
// 								.join(operator) +
// 							')'
// 						);
// 					case '$nor':
// 						// Handle $nor by negating a series of OR conditions
// 						return 'NOT (' + value.map(processCondition).join(' OR ') + ')';
// 					default:
// 						// Directly format key and value for SQL
// 						return format('%I = %L', key, value);
// 				}
// 			})
// 			.join(' AND '); // Join all top-level conditions with AND
// 	}

// 	// Start processing from the root of the query object
// 	return processCondition(query);
// }
export function mongoToSqlWhereClause(query) {
	const format = require('pg-format'); // ensure pg-format is available

	function processCondition(condition) {
		if (typeof condition !== 'object' || condition === null) {
			throw new Error('Invalid condition type');
		}

		const keys = Object.keys(condition);
		if (keys.length === 0) {
			return '';
		}

		const conditions = keys.map((key) => {
			const value = condition[key];
			if (key === '$or') {
				return '(' + value.map(processCondition).join(' OR ') + ')';
			} else if (key === '$and') {
				return '(' + value.map(processCondition).join(' AND ') + ')';
			} else if (key === '$nor') {
				// Handle the $nor operator by negating a series of OR conditions
				return 'NOT (' + value.map(processCondition).join(' OR ') + ')';
			} else {
				// Handle equality condition
				return format('%I = %L', key, value);
			}
		});

		// Enclose the final conjunction of conditions within parentheses
		return conditions.length === 1
			? conditions[0]
			: '(' + conditions.join(' AND ') + ')';
	}

	return processCondition(query);
}
